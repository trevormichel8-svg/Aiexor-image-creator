import Stripe from "stripe"
import { headers } from "next/headers"
import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // server only
)

export async function POST(req: Request) {
  const body = await req.text()
  const signature = headers().get("stripe-signature")!

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      webhookSecret
    )
  } catch (err) {
    return new NextResponse("Invalid signature", { status: 400 })
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session

    const userId = session.metadata?.user_id
    if (!userId) {
      return new NextResponse("Missing user ID", { status: 400 })
    }

    // Map Stripe price → credits
    let creditsToAdd = 0

    switch (session.amount_total) {
      case 699:
        creditsToAdd = 20
        break
      case 1399:
        creditsToAdd = 50
        break
      case 2499:
        creditsToAdd = 100
        break
      default:
        creditsToAdd = 0
    }

    if (creditsToAdd > 0) {
      await supabase.rpc("increment_credits", {
        uid: userId,
        amount: creditsToAdd,
      })
    }
  }

  return NextResponse.json({ received: true })
}
