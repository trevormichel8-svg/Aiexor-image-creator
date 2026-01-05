import Stripe from "stripe"
import { NextResponse } from "next/server"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export async function POST(req: Request) {
  const { plan, userId } = await req.json()

  if (!userId || !plan) {
    return NextResponse.json(
      { error: "Missing userId or plan" },
      { status: 400 }
    )
  }

  const priceId =
    plan === "pro"
      ? process.env.STRIPE_PRO_PRICE_ID
      : process.env.STRIPE_ELITE_PRICE_ID

  if (!priceId) {
    return NextResponse.json(
      { error: "Price not configured" },
      { status: 500 }
    )
  }

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    payment_method_types: ["card"],
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: "https://aiexor.com/?success=true",
    cancel_url: "https://aiexor.com/?cancelled=true",
    metadata: {
      userId,
      plan,
    },
  })

  return NextResponse.json({ url: session.url })
}

