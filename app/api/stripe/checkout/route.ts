import { NextResponse } from 'next/server'
import { stripe, PRICES } from '@/lib/stripe'

export async function POST(req: Request) {
  const { pack } = await req.json()
  const p = (PRICES as any)[pack]
  if (!p) return NextResponse.json({ error: 'Invalid pack' }, { status: 400 })

  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    payment_method_types: ['card'],
    line_items: [{
      price_data: {
        currency: 'usd',
        product_data: { name: `${p.credits} Credits` },
        unit_amount: p.amount
      },
      quantity: 1
    }],
    success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/?success=1`,
    cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/?canceled=1`,
    metadata: { credits: String(p.credits) }
  })

  return NextResponse.json({ url: session.url })
}