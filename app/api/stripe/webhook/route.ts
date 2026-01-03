
import { NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { addCredits } from '@/lib/credits'
import { headers } from 'next/headers'

export async function POST(req: Request) {
  const sig = headers().get('stripe-signature')!
  const body = await req.text()
  const event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!)
  if (event.type === 'checkout.session.completed') {
    const s:any = event.data.object
    addCredits(parseInt(s.metadata.credits,10))
  }
  return NextResponse.json({ ok:true })
}
