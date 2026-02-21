import { NextResponse } from 'next/server';
import { db } from '../../../../db';
import { todos } from '../../../../db/schema';
import { resend } from '../../../../lib/resend';
import { lte, isNull, and } from 'drizzle-orm';
import { createClerkClient } from '@clerk/nextjs/server';

const clerkClient = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY });

export async function GET(request: Request) {
    // Check for authorization (e.g., CRON_SECRET) if this was a real production app
    // const authHeader = request.headers.get('authorization');
    // if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    //     return new Response('Unauthorized', { status: 401 });
    // }

    try {
        const now = new Date();

        // Find todos with reminder date in the past that haven't been completed
        // For simplicity, we'll find all with reminderDate <= now
        // In a real app, you might want a "reminderSent" flag to avoid double sending
        const dueTodos = await db
            .select()
            .from(todos)
            .where(
                and(
                    lte(todos.reminderDate, now),
                    lte(todos.completed, false) // Only active tasks
                )
            );

        if (dueTodos.length === 0) {
            return NextResponse.json({ message: 'No reminders due' });
        }

        const results = await Promise.all(
            dueTodos.map(async (todo) => {
                try {
                    // Get user email from Clerk
                    const user = await clerkClient.users.getUser(todo.userId);
                    const email = user.emailAddresses[0]?.emailAddress;

                    if (!email) {
                        return { id: todo.id, status: 'failed', reason: 'No email found' };
                    }

                    // Send email
                    await resend.emails.send({
                        from: 'Tasks App <onboarding@resend.dev>',
                        to: email,
                        subject: `Reminder: ${todo.text}`,
                        html: `
                            <h1>To-Do Reminder</h1>
                            <p>This is a reminder for your task:</p>
                            <p><strong>${todo.text}</strong></p>
                            <p>Due: ${todo.reminderDate?.toLocaleString()}</p>
                            <hr />
                            <p><a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}">View your tasks</a></p>
                        `,
                    });

                    // Clear reminder date after sending to prevent multiple notifications
                    // Alternatively, add a 'reminderSent' boolean to the schema
                    await db
                        .update(todos)
                        .set({ reminderDate: null })
                        .where(lte(todos.id, todo.id));

                    return { id: todo.id, status: 'sent' };
                } catch (err: any) {
                    console.error(`Failed to send reminder for ${todo.id}:`, err);
                    return { id: todo.id, status: 'failed', error: err.message };
                }
            })
        );

        return NextResponse.json({ processed: dueTodos.length, results });
    } catch (error: any) {
        console.error('Cron job error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
