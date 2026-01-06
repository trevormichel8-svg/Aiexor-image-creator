import { NextResponse } from "next/server"
import Stripe from "stripe"
import { createClient } from "@supabase/supabase-js"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: Request) {
  const body = await req.text()
  const sig = req.headers.get("stripe-signature")

  if (!sig) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 })
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err) {
    console.error("Webhook signature verification failed", err)
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 })
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session

        const userId = session.metadata?.userId
        const credits = Number(session.metadata?.credits ?? 0)

        if (!userId || !credits) break

        await supabase
          .from("user_credits")
          .upsert(
            { user_id: userId, credits },
            { onConflict: "user_id" }
          )

        break
      }

      case "invoice.payment_succeeded": {
        const invoice = event.data.object as Stripe.Invoice

        // TS-safe access (Stripe types lag reality)
        const subscriptionId =
          typeof (invoice as any).subscription === "string"
            ? (invoice as any).subscription
            : null

        if (!subscriptionId) break

        const subscription =
          await stripe.subscriptions.retrieve(subscriptionId)

        const userId = subscription.metadata.userId
        const plan = subscription.metadata.plan

        if (!userId || !plan) break

        const credits =
          plan === "pro" ? 200 :
          plan === "elite" ? 500 : 0

        if (!credits) break

        await supabase
          .from("user_credits")
          .upsert(
            { user_id: userId, credits },
            { onConflict: "user_id" }
          )

        break
      }
    }

    return NextResponse.json({ received: true })
  } catch (err) {
    console.error("Webhook handler error", err)
    return NextResponse.json({ error: "Webhook failed" }, { status: 500 })
  }
}

// 🔒 REQUIRED so Next.js treats this as a module
export {}
