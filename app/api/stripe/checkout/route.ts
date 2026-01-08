import { NextResponse } from "next/server"
import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  
})

export async function POST(req: Request) {
  try {
    const { plan, userId, email } = await req.json()

    if (!plan || !userId) {
      return NextResponse.json(
        { error: "Missing plan or userId" },
        { status: 400 }
      )
    }

    // 🔒 REAL STRIPE PRICE IDS ONLY
    const PRICE_BY_PLAN: Record<string, string> = {
      pro: "price_1SmO6tRYoDtZ3J2YUjVeOB6O",
      elite: "price_1SmO6ARYoDtZ3J2YqTQWIznT",
    }

    const priceId = PRICE_BY_PLAN[plan]

    if (!priceId) {
      return NextResponse.json({ error: "Invalid plan" }, { status: 400 })
    }

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      customer_email: email ?? undefined,

      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],

      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/?cancelled=true`,

      // 🔑 THIS IS THE CRITICAL FIX
      metadata: {
        user_id: userId,
        plan,
      },

      // 🔑 ENSURE METADATA IS COPIED TO SUBSCRIPTION
      subscription_data: {
        metadata: {
          user_id: userId,
          plan,
        },
      },
    })

    return NextResponse.json({ url: session.url })
  } catch (err) {
    console.error("Stripe checkout error:", err)
    return NextResponse.json(
      { error: "Stripe checkout failed" },
      { status: 500 }
    )
  }
}
