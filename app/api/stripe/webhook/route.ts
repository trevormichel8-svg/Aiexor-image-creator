import { NextResponse } from "next/server"
import Stripe from "stripe"
import { createClient } from "@supabase/supabase-js"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: Request) {
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
  } catch (err: any) {
    console.error("Webhook signature verification failed", err.message)
    return NextResponse.json({ error: "Webhook error" }, { status: 400 })
  }

  try {
    // ─────────────────────────────────────────────
    // 1️⃣ INITIAL SUBSCRIPTION CHECKOUT
    // ─────────────────────────────────────────────
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session

      const userId = session.metadata?.userId
      const plan = session.metadata?.plan

      if (!userId || !plan) {
        return NextResponse.json({ received: true })
      }

      const credits =
        plan === "pro" ? 200 :
        plan === "elite" ? 500 : 0

      await supabase
        .from("user_credits")
        .upsert(
          { user_id: userId, credits },
          { onConflict: "user_id" }
        )
    }

    // ─────────────────────────────────────────────
    // 2️⃣ MONTHLY RENEWALS
    // ─────────────────────────────────────────────
    if (event.type === "invoice.payment_succeeded") {
      const invoice = event.data.object as Stripe.Invoice

      const subscriptionId = invoice.subscription as string | null
      if (!subscriptionId) {
        return NextResponse.json({ received: true })
      }

      const subscription = await stripe.subscriptions.retrieve(subscriptionId)

      const userId = subscription.metadata?.userId
      const plan = subscription.metadata?.plan

      if (!userId || !plan) {
        return NextResponse.json({ received: true })
      }

      const credits =
        plan === "pro" ? 200 :
        plan === "elite" ? 500 : 0

      await supabase
        .from("user_credits")
        .upsert(
          { user_id: userId, credits },
          { onConflict: "user_id" }
        )
    }

    return NextResponse.json({ received: true })
  } catch (err) {
    console.error("Webhook handler failed", err)
    return NextResponse.json({ error: "Webhook failed" }, { status: 500 })
  }
}
