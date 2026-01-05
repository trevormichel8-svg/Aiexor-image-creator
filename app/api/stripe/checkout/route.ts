import { NextResponse } from "next/server"
import Stripe from "stripe"
import { createClient } from "@supabase/supabase-js"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20",
})

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: Request) {
  try {
    const { plan } = await req.json()

    if (!plan || !["pro", "elite"].includes(plan)) {
      return NextResponse.json({ error: "Invalid plan" }, { status: 400 })
    }

    /* 🔑 Get logged-in user from Supabase */
    const authHeader = req.headers.get("authorization")
    if (!authHeader) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    const token = authHeader.replace("Bearer ", "")
    const { data: userData, error } = await supabase.auth.getUser(token)

    if (error || !userData?.user) {
      return NextResponse.json({ error: "Auth failed" }, { status: 401 })
    }

    const user = userData.user

    /* 🔁 Stripe price IDs */
    const priceId =
      plan === "pro"
        ? process.env.STRIPE_PRO_PRICE_ID!
        : process.env.STRIPE_ELITE_PRICE_ID!

    /* 🧾 Create Checkout Session */
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/?cancelled=true`,
      metadata: {
        userId: user.id,
        plan,
      },
    })

    return NextResponse.json({ url: session.url })
  } catch (err: any) {
    console.error("Stripe checkout error:", err)
    return NextResponse.json(
      { error: "Checkout failed" },
      { status: 500 }
    )
  }
}
