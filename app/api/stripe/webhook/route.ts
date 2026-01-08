import Stripe from "stripe"
import { headers } from "next/headers"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  
})

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(req: Request) {
  const body = await req.text()
  const sig = headers().get("stripe-signature")

  if (!sig) {
    return new Response("Missing Stripe signature", { status: 400 })
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret)
  } catch (err) {
    console.error("❌ Webhook signature verification failed:", err)
    return new Response("Webhook Error", { status: 400 })
  }

  // Only process successful subscription payments
  if (event.type !== "invoice.paid") {
    return new Response("Ignored event", { status: 200 })
  }

  const invoice = event.data.object as Stripe.Invoice

  /**
   * STEP 1 — Resolve user_id
   * Stripe subscription invoices store metadata on:
   * - invoice.lines.data[0].metadata
   * - invoice.parent.subscription_details.metadata
   */

  let userId =
    invoice.lines?.data?.[0]?.metadata?.user_id ?? null

  if (!userId) {
    userId =
      (invoice.parent as any)?.subscription_details?.metadata?.user_id ??
      null
  }

  if (!userId) {
    console.error("❌ No user_id found on invoice", invoice.id)
    return new Response("Missing user_id", { status: 400 })
  }

  /**
   * STEP 2 — Get Stripe price ID
   */
  const priceId =
    invoice.lines?.data?.[0]?.pricing?.price_details?.price

  if (!priceId) {
    console.error("❌ Missing price ID on invoice", invoice.id)
    return new Response("Missing price ID", { status: 400 })
  }

  /**
   * STEP 3 — Map price → credits
   * Must match your Stripe prices
   */
  const CREDITS_BY_PRICE: Record<string, number> = {
    "price_1SmO6tRYoDtZ3J2YUjVeOB6O": 200, // Pro
    "price_1SmO6ARYoDtZ3J2YqTQWIznT": 500, // Elite
  }

  const creditsToAdd = CREDITS_BY_PRICE[priceId]

  if (!creditsToAdd) {
    console.error("❌ Unknown Stripe price ID:", priceId)
    return new Response("Unknown price", { status: 400 })
  }

  /**
   * STEP 4 — Increment credits in Supabase (idempotent)
   */
  const supabaseRes = await fetch(
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
        p_reason: "stripe_invoice_paid",
        p_stripe_event_id: event.id,
      }),
    }
  )

  if (!supabaseRes.ok) {
    const text = await supabaseRes.text()
    console.error("❌ Supabase RPC failed:", text)
    return new Response("Credit increment failed", { status: 500 })
  }

  return new Response("Credits added", { status: 200 })
}
