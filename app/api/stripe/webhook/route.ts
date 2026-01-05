import { NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"
import { createClient } from "@supabase/supabase-js"

export const runtime = "nodejs"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: NextRequest) {
  const sig = req.headers.get("stripe-signature")

  if (!sig) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 })
  }

  let event: Stripe.Event

  try {
    const body = await req.text()

    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err) {
    console.error("Webhook verification failed:", err)
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 })
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session

    const userId = session.metadata?.user_id
    const credits = Number(session.metadata?.credits || 0)

    if (!userId || !credits) {
      return NextResponse.json({ error: "Missing metadata" }, { status: 400 })
    }

    const { error } = await supabase.rpc("increment_credits", {
      uid: userId,
      amount: credits,
    })

    if (error) {
      console.error("Supabase error:", error)
      return NextResponse.json({ error: "DB error" }, { status: 500 })
    }
  }

  return NextResponse.json({ received: true })
}
