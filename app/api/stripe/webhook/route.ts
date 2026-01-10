import Stripe from "stripe"
import { headers } from "next/headers"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(req: Request) {
  const body = await req.text()
  const sig = headers().get("stripe-signature")

  if (!sig) {
    return new Response("Missing stripe signature", { status: 400 })
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret)
  } catch (err) {
    console.error("Webhook signature verification failed", err)
    return new Response("Invalid signature", { status: 400 })
  }

  console.log("🔔 Stripe event:", event.type)

  // ✅ Handle checkout completion
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session

    const userId = session.metadata?.user_id
    const priceId = session.metadata?.price_id

    if (!userId || !priceId) {
      console.error("Missing metadata", session.metadata)
      return new Response("Missing metadata", { status: 400 })
    }

    // ✅ CREDIT MAP (Elite = 800)
    const CREDITS_BY_PRICE: Record<string, number> = {
      "price_1SmO6tRYoDtZ3J2YUjVeOB6O": 300, // Pro
      "price_1SmO6ARYoDtZ3J2YqTQWIznT": 800, // Elite
    }

    const creditsToAdd = CREDITS_BY_PRICE[priceId]

    if (!creditsToAdd) {
      console.error("Unknown price ID:", priceId)
      return new Response("Unknown price", { status: 400 })
    }

    console.log("➕ Adding credits:", creditsToAdd)

    // ✅ Call Supabase RPC via REST (NO client import needed)
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
    console.log("📨 Supabase RPC:", res.status, text)

    if (!res.ok) {
      return new Response("Failed to apply credits", { status: 500 })
    }

    return new Response("Credits applied", { status: 200 })
  }

  // Ignore everything else
  return new Response("Ignored", { status: 200 })
}
