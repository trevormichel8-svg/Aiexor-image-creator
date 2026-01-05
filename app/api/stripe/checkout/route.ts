import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import Stripe from "stripe"
import { createClient } from "@supabase/supabase-js"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      persistSession: false,
    },
  }
)

export async function POST(req: Request) {
  try {
    const { plan } = await req.json()

    if (!plan) {
      return NextResponse.json({ error: "Missing plan" }, { status: 400 })
    }

    // 🔑 Read auth cookie manually
    const cookieStore = cookies()
    const accessToken = cookieStore.get("sb-access-token")?.value

    if (!accessToken) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    const {
      data: { user },
      error,
    } = await supabase.auth.getUser(accessToken)

    if (!user || error) {
      return NextResponse.json({ error: "Invalid session" }, { status: 401 })
    }

    const priceId =
      plan === "pro"
        ? process.env.STRIPE_PRO_PRICE_ID
        : plan === "elite"
        ? process.env.STRIPE_ELITE_PRICE_ID
        : null

    if (!priceId) {
      return NextResponse.json({ error: "Invalid plan" }, { status: 400 })
    }

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      customer_email: user.email!,
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/`,
      metadata: {
        userId: user.id,
        plan,
      },
    })

    return NextResponse.json({ url: session.url })
  } catch (err: any) {
    console.error("Checkout error:", err)
    return NextResponse.json(
      { error: "Failed to start checkout" },
      { status: 500 }
    )
  }
}
