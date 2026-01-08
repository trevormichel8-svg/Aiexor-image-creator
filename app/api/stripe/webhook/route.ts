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
    console.error("❌ Missing stripe-signature header")
    return new Response("Missing signature", { status: 400 })
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret)
  } catch (err) {
    console.error("❌ Signature verification failed", err)
    return new Response("Webhook Error", { status: 400 })
  }

  console.log("📦 Event type:", event.type)

  if (event.type !== "invoice.paid") {
    console.log("⏭️ Ignored event")
    return new Response("Ignored", { status: 200 })
  }

  const invoice = event.data.object as Stripe.Invoice

  const userId =
    invoice.lines?.data?.[0]?.metadata?.user_id ??
    (invoice.parent as any)?.subscription_details?.metadata?.user_id

  console.log("👤 userId:", userId)

  if (!userId) {
    console.error("❌ userId missing")
    return new Response("Missing userId", { status: 400 })
  }

  const priceId =
    invoice.lines?.data?.[0]?.pricing?.price_details?.price as string

  console.log("💰 priceId:", priceId)

  const CREDITS_BY_PRICE: Record<string, number> = {
    "price_1SmO6tRYoDtZ3J2YUjVeOB6O": 200,
    "price_1SmO6ARYoDtZ3J2YqTQWIznT": 500,
  }

  const creditsToAdd = CREDITS_BY_PRICE[priceId]

  console.log("➕ creditsToAdd:", creditsToAdd)

  if (!creditsToAdd) {
    console.error("❌ Unknown price")
    return new Response("Unknown price", { status: 400 })
  }

  console.log("🚀 Calling Supabase RPC")

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
        p_reason: "stripe_invoice_paid",
        p_stripe_event_id: event.id,
      }),
    }
  )

  const text = await res.text()
  console.log("📨 Supabase response:", res.status, text)

  if (!res.ok) {
    console.error("❌ Supabase failed")
    return new Response("Supabase error", { status: 500 })
  }

  console.log("✅ CREDITS APPLIED")
  return new Response("OK", { status: 200 })
}
