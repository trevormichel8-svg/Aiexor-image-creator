import Stripe from "stripe"
import { headers } from "next/headers"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  
})

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(req: Request) {
  console.log("🔥 WEBHOOK HIT")

  const body = await req.text()
  const sig = headers().get("stripe-signature")

  if (!sig) {
    console.error("❌ Missing stripe-signature")
    return new Response("Missing signature", { status: 400 })
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret)
  } catch (err) {
    console.error("❌ Signature verification failed", err)
    return new Response("Webhook error", { status: 400 })
  }

  console.log("📦 Event type:", event.type)

  // ✅ HANDLE CHECKOUT COMPLETION
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session

    const userId = session.metadata?.user_id

    if (!userId || !session.subscription) {
      console.error("❌ Missing user_id or subscription")
      return new Response("Missing data", { status: 400 })
    }

    // 🔑 Retrieve subscription to get price ID
    const subscription = await stripe.subscriptions.retrieve(
      session.subscription as string
    )

    const priceId = subscription.items.data[0].price.id

    console.log("👤 userId:", userId)
    console.log("💰 priceId:", priceId)

    const CREDITS_BY_PRICE: Record<string, number> = {
      "price_1SmO6tRYoDtZ3J2YUjVeOB6O": 200, // Pro
      "price_1SmO6ARYoDtZ3J2YqTQWIznT": 500, // Elite
    }

    const creditsToAdd = CREDITS_BY_PRICE[priceId]

    if (!creditsToAdd) {
      console.error("❌ Unknown price ID:", priceId)
      return new Response("Unknown price", { status: 400 })
    }

    console.log("➕ creditsToAdd:", creditsToAdd)

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/rpc/increment_user_credits`,
      {
        method: "POST",
        headers: {
          apikey: process.env.SUPABASE_SERVICE_ROLE_KEY!,
          Authorization: `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY!}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          p_user_id: userId,
          p_amount: creditsToAdd,
          p_reason: "checkout_completed",
          p_stripe_event_id: event.id,
        }),
      }
    )

    const text = await res.text()
    console.log("📨 Supabase response:", res.status, text)

    return new Response("Credits applied", { status: 200 })
  }

  // Optional safety
  if (event.type === "invoice.paid") {
    console.log("ℹ️ invoice.paid received (ignored)")
    return new Response("OK", { status: 200 })
  }

  console.log("⏭️ Ignored event")
  return new Response("Ignored", { status: 200 })
}
