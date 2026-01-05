import { NextResponse } from "next/server"
import Stripe from "stripe"

/**
 * Canonical credit packs
 * Frontend MUST match these numbers
 */
const CREDIT_PACKS: Record<number, { amount: number }> = {
  20: { amount: 699 },
  50: { amount: 1399 },
  100: { amount: 2499 },
}

export async function POST(req: Request) {
  try {
    const secretKey = process.env.STRIPE_SECRET_KEY

    if (!secretKey) {
      console.error("STRIPE_SECRET_KEY missing")
      return NextResponse.json(
        { error: "Stripe not configured" },
        { status: 500 }
      )
    }

    // ✅ Lazy init Stripe (CRITICAL FIX)
    const stripe = new Stripe(secretKey)

    const body = await req.json()
    const credits = Number(body.credits)

    if (!credits || !CREDIT_PACKS[credits]) {
      return NextResponse.json(
        { error: "Invalid credit pack" },
        { status: 400 }
      )
    }

    const pack = CREDIT_PACKS[credits]

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: `${credits} AI Image Credits`,
            },
            unit_amount: pack.amount,
          },
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}?success=1`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}?cancel=1`,
      metadata: {
        credits: String(credits),
      },
    })

    return NextResponse.json({ url: session.url })
  } catch (err) {
    console.error("Stripe checkout error:", err)
    return NextResponse.json(
      { error: "Checkout failed" },
      { status: 500 }
    )
  }
}
