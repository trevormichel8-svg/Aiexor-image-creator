import Stripe from "stripe"
import { headers } from "next/headers"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export async function POST(req: Request) {
  const body = await req.text()
  const sig = headers().get("stripe-signature")

  if (!sig) {
    return new Response("Missing signature", { status: 400 })
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch {
    return new Response("Webhook error", { status: 400 })
  }

  /* ===============================
     1️⃣ SUBSCRIPTION START
     =============================== */
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session
    const userId = session.metadata?.user_id

    if (userId) {
      await setSubscriptionActive(userId, true)
    }

    return new Response("OK", { status: 200 })
  }

  /* ===============================
     2️⃣ SUBSCRIPTION CANCELED
     =============================== */
  if (
    event.type === "customer.subscription.deleted" ||
    (event.type === "customer.subscription.updated" &&
      (event.data.object as Stripe.Subscription).status === "canceled")
  ) {
    const sub = event.data.object as Stripe.Subscription
    const userId = sub.metadata?.user_id

    if (userId) {
      await setSubscriptionActive(userId, false)
    }

    return new Response("OK", { status: 200 })
  }

  /* ===============================
     3️⃣ MONTHLY RENEWAL
     =============================== */
  if (event.type === "invoice.paid") {
    const invoice = event.data.object as Stripe.Invoice

    if (invoice.billing_reason !== "subscription_cycle") {
      return new Response("Ignored", { status: 200 })
    }

    const line = invoice.lines.data[0]
    const userId =
      line.metadata?.user_id ??
      (invoice.parent as any)?.subscription_details?.metadata?.user_id

    if (!userId) {
      return new Response("Missing user", { status: 400 })
    }

    // 🔒 Check subscription_active
    const { data } = await fetch(
      `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/user_credits?user_id=eq.${userId}&select=subscription_active`,
      {
        headers: {
          apikey: process.env.SUPABASE_SERVICE_ROLE_KEY!,
          Authorization: `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY!}`,
        },
      }
    ).then(r => r.json())

    if (!data?.[0]?.subscription_active) {
      return new Response("Subscription inactive", { status: 200 })
    }

    const priceId = line.pricing?.price_details?.price as string

    const CREDITS_BY_PRICE: Record<string, number> = {
      "price_1SmO6tRYoDtZ3J2YUjVeOB6O": 200,
      "price_1SmO6ARYoDtZ3J2YqTQWIznT": 800,
    }

    const creditsToAdd = CREDITS_BY_PRICE[priceId]
    if (!creditsToAdd) {
      return new Response("Unknown price", { status: 400 })
    }

    await addCredits(userId, creditsToAdd, event.id, "subscription_renewal")

    return new Response("Credits added", { status: 200 })
  }

  return new Response("Ignored", { status: 200 })
}

/* ===============================
   Helpers
   =============================== */

async function setSubscriptionActive(userId: string, active: boolean) {
  await fetch(
    `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/user_credits?user_id=eq.${userId}`,
    {
      method: "PATCH",
      headers: {
        apikey: process.env.SUPABASE_SERVICE_ROLE_KEY!,
        Authorization: `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY!}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ subscription_active: active }),
    }
  )
}

async function addCredits(
  userId: string,
  amount: number,
  eventId: string,
  reason: string
) {
  await fetch(
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
        p_amount: amount,
        p_reason: reason,
        p_stripe_event_id: eventId,
      }),
    }
  )
}
