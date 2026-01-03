import { NextRequest, NextResponse } from "next/server"
import { stripe, PRICES } from "@/lib/stripe"
import { addCredits } from "@/lib/credits"

export async function POST(req: NextRequest) {
  const sig = req.headers.get("stripe-signature")!
  const body = await req.text()

  let event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 })
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as any

    const userId = session.metadata.user_id
    const pack = session.metadata.pack

    if (userId && PRICES[pack]) {
      await addCredits(userId, PRICES[pack].credits)
    }
  }

  return NextResponse.json({ received: true })
}
