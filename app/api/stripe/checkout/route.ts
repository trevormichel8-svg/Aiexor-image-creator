import { NextResponse } from "next/server"
import Stripe from "stripe"
import { supabaseServerAuth } from "@/lib/supabaseServerAuth"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export async function POST(req: Request) {
  try {
    const { plan } = await req.json()

    if (!plan) {
      return NextResponse.json({ error: "Missing plan" }, { status: 400 })
    }

    // ✅ AUTH: read signed-in user from cookies
    const supabase = supabaseServerAuth()
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser()

    if (error || !user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    // 💰 Pricing (cents)
    const prices: Record<string, { amount: number; name: string }> = {
      pro: { amount: 2999, name: "Pro Plan" },
      elite: { amount: 4999, name: "Elite Plan" },
    }

    const selected = prices[plan]
    if (!selected) {
      return NextResponse.json({ error: "Invalid plan" }, { status: 400 })
    }

    // 🧾 Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            unit_amount: selected.amount,
            recurring: { interval: "month" },
            product_data: {
              name: selected.name,
            },
          },
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}?cancelled=true`,
      metadata: {
        userId: user.id,
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
