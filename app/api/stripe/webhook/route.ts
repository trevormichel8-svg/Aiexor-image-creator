import Stripe from "stripe"
import { headers } from "next/headers"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

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
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err) {
    console.error("❌ Signature verification failed", err)
    return new Response("Webhook error", { status: 400 })
  }

  console.log("📦 Event type:", event.type)

  /**
   * ================================
   * 1️⃣ INITIAL PURCHASE (checkout)
   * ================================
   */
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session

    const userId = session.metadata?.user_id
    const priceId = session.metadata?.price_id

    if (!userId || !priceId) {
      console.error("❌ Missing metadata on checkout session")
      return new Response("Missing metadata", { status: 400 })
    }

    const CREDITS_BY_PRICE: Record<string, number> = {
      "price_1SmO6tRYoDtZ3J2YUjVeOB6O": 200, // Pro
      "price_1SmO6ARYoDtZ3J2YqTQWIznT": 800, // Elite ✅
    }

    const creditsToAdd = CREDITS_BY_PRICE[priceId]

    if (!creditsToAdd) {
      console.error("❌ Unknown price:", priceId)
      return new Response("Unknown price", { status: 400 })
    }

    await addCredits({
      userId,
      amount: creditsToAdd,
      reason: "subscription_started",
      eventId: event.id,
    })

    return new Response("Initial credits applied", { status: 200 })
  }

  /**
   * ==================================
   * 2️⃣ MONTHLY RENEWAL (invoice.paid)
   * ==================================
   */
  if (event.type === "invoice.paid") {
    const invoice = event.data.object as Stripe.Invoice

    // 🔒 Only monthly renewals (not first invoice)
    if (invoice.billing_reason !== "subscription_cycle") {
      console.log("⏭️ Ignoring non-renewal invoice")
      return new Response("Ignored", { status: 200 })
    }

    const line = invoice.lines.data[0]

    const userId =
      line.metadata?.user_id ??
      (invoice.parent as any)?.subscription_details?.metadata?.user_id

    const priceId = line.pricing?.price_details?.price as string

    if (!userId || !priceId) {
      console.error("❌ Missing renewal metadata")
      return new Response("Missing data", { status: 400 })
    }

    const CREDITS_BY_PRICE: Record<string, number> = {
      "price_1SmO6tRYoDtZ3J2YUjVeOB6O": 200,
      "price_1SmO6ARYoDtZ3J2YqTQWIznT": 800,
    }

    const creditsToAdd = CREDITS_BY_PRICE[priceId]

    if (!creditsToAdd) {
      console.error("❌ Unknown renewal price:", priceId)
      return new Response("Unknown price", { status: 400 })
    }

    await addCredits({
      userId,
      amount: creditsToAdd,
      reason: "subscription_renewal",
      eventId: event.id,
    })

    return new Response("Renewal credits applied", { status: 200 })
  }

  console.log("⏭️ Ignored event")
  return new Response("Ignored", { status: 200 })
}

/**
 * ==================================
 * 🔧 SHARED CREDIT HELPER
 * ==================================
 */
async function addCredits({
  userId,
  amount,
  reason,
  eventId,
}: {
  userId: string
  amount: number
  reason: string
  eventId: string
}) {
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
        p_amount: amount,
        p_reason: reason,
        p_stripe_event_id: eventId,
      }),
    }
  )

  const text = await res.text()
  console.log("📨 Supabase:", res.status, text)

  if (!res.ok) {
    throw new Error("Failed to apply credits")
  }
}A
