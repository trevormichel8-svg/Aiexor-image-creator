import { NextRequest, NextResponse } from "next/server"
import { getStripe, PRICES } from "@/lib/stripe"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { pack } = body

    if (!pack || !PRICES[pack]) {
      return NextResponse.json(
        { error: "Invalid credit pack" },
        { status: 400 }
      )
    }

    const stripe = getStripe()

    const price = PRICES[pack]

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: `${price.credits} Credits`,
              description: "Aiexor AI Image Credits",
            },
            unit_amount: price.amount, // cents
          },
          quantity: 1,
        },
      ],
      metadata: {
        credits: String(price.credits),
      },
      success_url: "https://aiexor.com?payment=success",
      cancel_url: "https://aiexor.com?payment=cancelled",
    })

    if (!session.url) {
      return NextResponse.json(
        { error: "Failed to create checkout session" },
        { status: 500 }
      )
    }

    return NextResponse.json({ url: session.url })
  } catch (err) {
    console.error("Stripe checkout error:", err)
    return NextResponse.json(
      { error: "Checkout failed" },
      { status: 500 }
    )
  }
}
