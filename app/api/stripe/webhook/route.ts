import Stripe from "stripe"
import { headers } from "next/headers"
import { NextResponse } from "next/server"

export const runtime = "nodejs" // IMPORTANT for Stripe

const stripeSecretKey = process.env.STRIPE_SECRET_KEY
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

if (!stripeSecretKey) {
  throw new Error("Missing STRIPE_SECRET_KEY")
}

const stripe = new Stripe(stripeSecretKey)

export async function POST(req: Request) {
  if (!webhookSecret) {
    console.error("❌ STRIPE_WEBHOOK_SECRET not set")
    return new NextResponse("Webhook secret not configured", { status: 500 })
  }

  let event: Stripe.Event

  try {
    const body = await req.text()
    const signature = headers().get("stripe-signature")

    if (!signature) {
      console.error("❌ Missing stripe-signature header")
      return new NextResponse("Missing signature", { status: 400 })
    }

    event = stripe.webhooks.constructEvent(
      body,
      signature,
      webhookSecret
    )
  } catch (err: any) {
    console.error("❌ Webhook signature verification failed:", err.message)
    return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 })
  }

  // ✅ At this point Stripe is VERIFIED
  console.log("✅ Stripe webhook received:", event.type)

  // We will handle logic in Step 3
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session

    console.log("💰 Checkout completed:", {
      sessionId: session.id,
      customerEmail: session.customer_details?.email,
      metadata: session.metadata,
    })
  }

  return NextResponse.json({ received: true })
}
