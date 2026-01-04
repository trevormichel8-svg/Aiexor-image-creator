import { NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"
import { createClient } from "@supabase/supabase-js"

let stripe: Stripe | null = null

function getStripe() {
  if (!stripe) {
    const key = process.env.STRIPE_SECRET_KEY
    if (!key) {
      throw new Error("STRIPE_SECRET_KEY not set")
    }
    // IMPORTANT: do NOT pass apiVersion to avoid TS literal mismatch
    stripe = new Stripe(key)
  }
  return stripe
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // server-only
)

export async function POST(req: NextRequest) {
  const body = await req.text()
  const sig = req.headers.get("stripe-signature")

  if (!sig) {
    return NextResponse.json(
      { error: "Missing Stripe signature" },
      { status: 400 }
    )
  }

  let event: Stripe.Event

  try {
    const stripe = getStripe()
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err) {
    console.error("Webhook signature verification failed:", err)
    return NextResponse.json(
      { error: "Webhook verification failed" },
      { status: 400 }
    )
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session

    const credits = Number(session.metadata?.credits)
    const userId = session.client_reference_id

    if (!credits || !userId) {
      console.warn("Missing credits or userId in session metadata")
      return NextResponse.json({ received: true })
    }

    // Add credits to user
    await supabase.rpc("add_credits", {
      p_user_id: userId,
      p_amount: credits,
    })
  }

  return NextResponse.json({ received: true })
}
