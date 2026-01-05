import { NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export async function POST(req: NextRequest) {
  try {
    const { userId, credits } = await req.json()

    if (!userId || !credits) {
      return NextResponse.json(
        { error: "Missing userId or credits" },
        { status: 400 }
      )
    }

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: `${credits} Image Credits`,
            },
            unit_amount: credits * 10, // example: 1 credit = $0.10
          },
          quantity: 1,
        },
      ],
      metadata: {
        user_id: userId,
        credits: String(credits),
      },
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/success`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/cancel`,
    })

    return NextResponse.json({ url: session.url })
  } catch (err) {
    console.error("Checkout error:", err)
    return NextResponse.json({ error: "Stripe error" }, { status: 500 })
  }
}
