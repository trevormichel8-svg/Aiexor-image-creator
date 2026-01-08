import { NextResponse } from "next/server"
import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

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

    /**
     * 🔑 STEP 1 — Find or create Stripe customer (by user_id)
     */
    const existingCustomers = await stripe.customers.search({
      query: `metadata['user_id']:'${userId}'`,
      limit: 1,
    })

    const customer =
      existingCustomers.data.length > 0
        ? existingCustomers.data[0]
        : await stripe.customers.create({
            metadata: { user_id: userId },
          })

    /**
     * 🔒 STEP 2 — BLOCK if active subscription exists
     */
    const activeSubs = await stripe.subscriptions.list({
      customer: customer.id,
      status: "active",
      limit: 1,
    })

    if (activeSubs.data.length > 0) {
      return NextResponse.json(
        {
          error:
            "You already have an active subscription. You can resubscribe after it ends.",
        },
        { status: 400 }
      )
    }

    /**
     * ✅ STEP 3 — Create Checkout Session
     */
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
        user_id: userId,
        price_id: priceId,
        plan,
      },
    })

    return NextResponse.json({ url: session.url })
  } catch (err) {
    console.error("❌ Checkout error:", err)
    return NextResponse.json(
      { error: "Failed to start checkout" },
      { status: 500 }
    )
  }
}
