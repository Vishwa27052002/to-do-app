import { Webhook } from 'svix'
import { headers } from 'next/headers'
import { WebhookEvent } from '@clerk/nextjs/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: Request) {
    // You can find this in the Clerk Dashboard -> Webhooks -> choose the endpoint
    const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET

    if (!WEBHOOK_SECRET) {
        throw new Error('Please add CLERK_WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local')
    }

    // Get the headers
    const headerPayload = await headers()
    const svix_id = headerPayload.get('svix-id')
    const svix_timestamp = headerPayload.get('svix-timestamp')
    const svix_signature = headerPayload.get('svix-signature')

    // If there are no headers, error out
    if (!svix_id || !svix_timestamp || !svix_signature) {
        return new Response('Error occured -- no svix headers', {
            status: 400,
        })
    }

    // Get the body
    const payload = await req.json()
    const body = JSON.stringify(payload)

    // Create a new Svix instance with your secret.
    const wh = new Webhook(WEBHOOK_SECRET)

    let evt: WebhookEvent

    // Verify the payload with the headers
    try {
        evt = wh.verify(body, {
            'svix-id': svix_id,
            'svix-timestamp': svix_timestamp,
            'svix-signature': svix_signature,
        }) as WebhookEvent
    } catch (err) {
        console.error('Error verifying webhook:', err)
        return new Response('Error occured', {
            status: 400,
        })
    }

    // Handle the webhook
    const eventType = evt.type

    if (eventType === 'user.created') {
        const { id, email_addresses, first_name } = evt.data

        const primaryEmail = email_addresses.find(
            (email) => email.id === evt.data.primary_email_address_id
        )

        if (primaryEmail) {
            try {
                await resend.emails.send({
                    from: 'Acme <onboarding@resend.dev>', // Update this with your verified domain
                    to: primaryEmail.email_address,
                    subject: 'Welcome to our To-Do App!',
                    html: `<p>Hi ${first_name || 'there'},</p><p>Welcome to our app! We're excited to have you.</p>`,
                })
                console.log(`Welcome email sent to ${primaryEmail.email_address}`)
            } catch (error) {
                console.error('Error sending welcome email:', error)
            }
        }
    }

    return new Response('', { status: 200 })
}
