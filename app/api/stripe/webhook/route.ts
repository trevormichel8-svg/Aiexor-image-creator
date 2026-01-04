import Stripe from "stripe"
import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

export const runtime = "nodejs"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16",
})

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // SERVER ONLY
)

export async function POST(req: Request) {
  const signature = req.headers.get("stripe-signature")
  if (!signature) {
    return new NextResponse("Missing Stripe signature", { status: 400 })
  }

  const body = await req.text()

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err: any) {
    console.error("Webhook verification failed:", err.message)
    return new NextResponse("Invalid signature", { status: 400 })
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session

    const userId = session.metadata?.user_id
    const credits = Number(session.metadata?.credits)

    if (!userId || !credits) {
      console.error("Missing metadata", session.metadata)
      return new NextResponse("Missing metadata", { status: 400 })
    }

    const { error } = await supabase.rpc("increment_credits", {
      uid: userId,
      amount: credits,
      stripe_event_id: event.id,
    })

    if (error) {
      console.error("Credit increment failed:", error)
      return new NextResponse("Database error", { status: 500 })
    }
  }

  return NextResponse.json({ received: true })
}
