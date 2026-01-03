import { NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { addCredits } from '@/lib/credits'
import { headers } from 'next/headers'

export async function POST(req: Request) {
  const body = await req.text()
  const sig = headers().get('stripe-signature')!
  let event: any

  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch {
    return new NextResponse('Webhook Error', { status: 400 })
  }

  if (event.type === 'checkout.session.completed') {
    const session: any = event.data.object
    const credits = parseInt(session.metadata?.credits || '0', 10)
    if (credits > 0) addCredits(credits)
  }

  return NextResponse.json({ received: true })
}