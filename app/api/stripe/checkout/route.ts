import { NextResponse } from "next/server"
import Stripe from "stripe"
import { createClient } from "@supabase/supabase-js"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16",
})

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// 🔐 Map plans → Stripe Price IDs
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

    // 🔹 Get user email from Supabase
    const { data: userData, error: userError } =
      await supabase.auth.admin.getUserById(userId)

    if (userError || !userData?.user?.email) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      )
    }

    const email = userData.user.email

    // 🔹 Find or create Stripe customer
    const existingCustomers = await stripe.customers.list({
      email,
      limit: 1,
    })

    const customer =
      existingCustomers.data.length > 0
        ? existingCustomers.data[0]
        : await stripe.customers.create({
            email,
            metadata: { user_id: userId },
          })

    // 🔒 BLOCK if user already has active subscription
    const activeSubs = await stripe.subscriptions.list({
      customer: customer.id,
      status: "active",
      limit: 1,
    })

    if (activeSubs.data.length > 0) {
      return NextResponse.json(
        { error: "You already have an active subscription" },
        { status: 400 }
      )
    }

    // ✅ Create Checkout Session
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      customer: customer.id,
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}?cancelled=true`,
      metadata: {
        user_id: userId, // 🔑 CRITICAL
        price_id: priceId,
        plan,
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
