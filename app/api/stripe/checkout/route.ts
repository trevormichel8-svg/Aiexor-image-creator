import { NextResponse } from "next/server"
import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  
})

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL!

// 🔑 Stripe price IDs → MUST match dashboard
const PRICE_BY_PLAN: Record<"pro" | "elite", string> = {
  pro: "price_1SmO6tRYoDtZ3J2YUjVeOB6O",
  elite: "price_1SmO6ARYoDtZ3J2YqTQWIznT",
}

export async function POST(req: Request) {
  try {
    const { plan, userId } = await req.json()

    if (!plan || !userId) {
      return NextResponse.json(
        { error: "Missing plan or userId" },
        { status: 400 }
      )
    }

    const priceId = PRICE_BY_PLAN[plan]
    if (!priceId) {
      return NextResponse.json({ error: "Invalid plan" }, { status: 400 })
    }

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${SITE_URL}/?success=true`,
      cancel_url: `${SITE_URL}/?cancelled=true`,

      // ✅ THIS IS THE CRITICAL LINK
      metadata: {
        user_id: userId,
        price_id: priceId,
      },
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
