import { NextResponse } from "next/server"
import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export async function POST(req: Request) {
  try {
    const { plan, userId } = await req.json()

    if (!plan || !userId) {
      return NextResponse.json(
        { error: "Missing plan or userId" },
        { status: 400 }
      )
    }

    const plans: Record<string, { amount: number; name: string }> = {
      pro: { amount: 2999, name: "Pro Plan" },
      elite: { amount: 4999, name: "Elite Plan" },
    }

    const selected = plans[plan]
    if (!selected) {
      return NextResponse.json({ error: "Invalid plan" }, { status: 400 })
    }

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            unit_amount: selected.amount,
            product_data: { name: selected.name },
            recurring: { interval: "month" },
          },
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}?cancelled=true`,

      // ✅ THIS IS THE ONLY REQUIRED FIX
      metadata: {
        user_id: userId, // must be snake_case
        plan,
      },
    })

    return NextResponse.json({ url: session.url })
  } catch (err) {
    console.error("STRIPE CHECKOUT ERROR:", err)
    return NextResponse.json(
      { error: "Stripe checkout failed" },
      { status: 500 }
    )
  }
}
