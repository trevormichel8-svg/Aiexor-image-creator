import { NextResponse } from "next/server"
import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  
})

const PRICE_BY_PLAN: Record<string, string> = {
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

    // ✅ Create checkout session directly
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}?cancelled=true`,
      metadata: {
        user_id: userId, // 🔑 webhook relies on this
        price_id: priceId,
        plan,
      },
    })

    return NextResponse.json({ url: session.url })
  } catch (err) {
    console.error("❌ Checkout error:", err)
    return NextResponse.json(
      { error: "Checkout failed" },
      { status: 500 }
    )
  }
}
