"use server";

import { db } from "../db";
import { todos } from "../db/schema";
import { auth } from "@clerk/nextjs/server";
import { eq, and, desc } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function getTodos() {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    return db
        .select()
        .from(todos)
        .where(eq(todos.userId, userId))
        .orderBy(desc(todos.createdAt));
}

export async function addTodo(text: string, reminderDate?: Date) {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    await db.insert(todos).values({
        userId,
        text,
        reminderDate,
    });

    revalidatePath("/");
}

export async function toggleTodo(id: string, completed: boolean) {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    await db
        .update(todos)
        .set({ completed })
        .where(and(eq(todos.id, id), eq(todos.userId, userId)));

    revalidatePath("/");
}

export async function deleteTodo(id: string) {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    await db.delete(todos).where(and(eq(todos.id, id), eq(todos.userId, userId)));

    revalidatePath("/");
}

export async function updateTodo(id: string, updates: Partial<{ text: string; completed: boolean; reminderDate: Date | null }>) {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    await db
        .update(todos)
        .set(updates)
        .where(and(eq(todos.id, id), eq(todos.userId, userId)));

    revalidatePath("/");
}
