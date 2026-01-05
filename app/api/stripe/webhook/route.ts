import { NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"
import { createClient } from "@supabase/supabase-js"

export const runtime = "nodejs"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
 
})

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { persistSession: false } }
)

export async function POST(req: NextRequest) {
  const sig = req.headers.get("stripe-signature")

  if (!sig) {
    return NextResponse.json({ error: "Missing Stripe signature" }, { status: 400 })
  }

  let event: Stripe.Event

  try {
    const body = await req.text()

    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err: any) {
    console.error("❌ Webhook verification failed:", err.message)
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 })
  }

  try {
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session

      const userId = session.metadata?.user_id
      const creditsRaw = session.metadata?.credits

      if (!userId || !creditsRaw) {
        console.error("❌ Missing metadata:", session.metadata)
        return NextResponse.json({ error: "Missing metadata" }, { status: 400 })
      }

      const credits = parseInt(creditsRaw, 10)

      if (isNaN(credits)) {
        return NextResponse.json({ error: "Invalid credit amount" }, { status: 400 })
      }

      const { error } = await supabase
        .from("user_credits")
        .upsert(
          {
            user_id: userId,
            credits,
          },
          { onConflict: "user_id" }
        )

      if (error) {
        console.error("❌ Supabase error:", error)
        return NextResponse.json({ error: "DB error" }, { status: 500 })
      }

      console.log(`✅ Credited ${credits} credits to user ${userId}`)
    }

    return NextResponse.json({ received: true })
  } catch (err) {
    console.error("❌ Webhook handler error:", err)
    return NextResponse.json({ error: "Webhook failed" }, { status: 500 })
  }
}
