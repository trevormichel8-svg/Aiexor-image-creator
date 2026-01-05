import { NextResponse } from "next/server"
import Stripe from "stripe"
import { createClient } from "@supabase/supabase-js"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  
})

export async function POST(req: Request) {
  const sig = req.headers.get("stripe-signature")

  if (!sig) {
    return NextResponse.json(
      { error: "Missing Stripe signature" },
      { status: 400 }
    )
  }

  const body = await req.text()

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err) {
    console.error("Webhook signature verification failed:", err)
    return NextResponse.json(
      { error: "Invalid signature" },
      { status: 400 }
    )
  }

  if (event.type !== "checkout.session.completed") {
    return NextResponse.json({ received: true })
  }

  const session = event.data.object as Stripe.Checkout.Session

  if (session.payment_status !== "paid") {
    return NextResponse.json({ received: true })
  }

  const userId = session.metadata?.userId
  const credits = Number(session.metadata?.credits)

  if (!userId || !credits) {
    console.error("Missing metadata:", session.metadata)
    return NextResponse.json(
      { error: "Missing metadata" },
      { status: 400 }
    )
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  // Upsert credits (add if exists, insert if not)
  const { data: existing, error: fetchError } = await supabase
    .from("user_credits")
    .select("credits")
    .eq("user_id", userId)
    .single()

  if (fetchError && fetchError.code !== "PGRST116") {
    console.error(fetchError)
    return NextResponse.json(
      { error: "Failed to fetch credits" },
      { status: 500 }
    )
  }

  const newCredits = (existing?.credits ?? 0) + credits

  const { error: upsertError } = await supabase
    .from("user_credits")
    .upsert({
      user_id: userId,
      credits: newCredits,
    })

  if (upsertError) {
    console.error(upsertError)
    return NextResponse.json(
      { error: "Failed to update credits" },
      { status: 500 }
    )
  }

  return NextResponse.json({ received: true })
}
