import { NextResponse } from "next/server"
import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-11-17.clover",
})

export async function POST(req: Request) {
  try {
    const { plan, user } = await req.json()

    if (!plan || !user?.id || !user?.email) {
      return NextResponse.json(
        { error: "Missing plan or user" },
        { status: 400 }
      )
    }

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
      customer_email: user.email,

      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],

      /**
       * ✅ THIS IS THE CRITICAL FIX
       */
      subscription_data: {
        metadata: {
          user_id: user.id,
          plan,
        },
      },

      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/?cancelled=true`,
    })

    return NextResponse.json({ url: session.url })
  } catch (err) {
    console.error("❌ Stripe checkout error:", err)
    return NextResponse.json(
      { error: "Stripe checkout failed" },
      { status: 500 }
    )
  }
}
