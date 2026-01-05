import Stripe from "stripe"
import { NextResponse } from "next/server"
import { headers } from "next/headers"
import { createClient } from "@supabase/supabase-js"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  
})

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

/* -------------------------------
   Helpers
-------------------------------- */
async function setCredits(userId: string, credits: number) {
  await supabase
    .from("user_credits")
    .upsert({ user_id: userId, credits }, { onConflict: "user_id" })
}

async function addCredits(userId: string, amount: number) {
  const { data } = await supabase
    .from("user_credits")
    .select("credits")
    .eq("user_id", userId)
    .single()

  const current = data?.credits ?? 0
  await setCredits(userId, current + amount)
}

/* -------------------------------
   Webhook handler
-------------------------------- */
export async function POST(req: Request) {
  const body = await req.text()
  const signature = headers().get("stripe-signature")!

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err: any) {
    console.error("Webhook signature verification failed:", err.message)
    return new NextResponse("Invalid signature", { status: 400 })
  }

  try {
    /* ---------------------------
       Checkout completed
    ---------------------------- */
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session

      // Attach metadata to subscription
      if (session.mode === "subscription" && session.subscription) {
        await stripe.subscriptions.update(
          session.subscription as string,
          {
            metadata: {
              userId: session.metadata?.userId!,
              plan: session.metadata?.plan!,
            },
          }
        )
      }

      // One-time credit packs
      const userId = session.metadata?.userId
      const credits = Number(session.metadata?.credits)

      if (userId && credits > 0) {
        await addCredits(userId, credits)
      }
    }

    /* ---------------------------
       Subscription renewal
    ---------------------------- */
    if (event.type === "invoice.payment_succeeded") {
      /**
       * Stripe Clover typings DO NOT expose `subscription`
       * even though it exists at runtime.
       * We must manually narrow the type.
       */
      const invoice = event.data.object as Stripe.Invoice & {
        subscription?: string | null
      }

      if (!invoice.subscription) {
        return NextResponse.json({ received: true })
      }

      const subscription = await stripe.subscriptions.retrieve(
        invoice.subscription
      )

      const userId = subscription.metadata.userId
      const plan = subscription.metadata.plan

      if (!userId || !plan) {
        return NextResponse.json({ received: true })
      }

      const monthlyCredits =
        plan === "pro" ? 200 :
        plan === "elite" ? 500 :
        0

      if (monthlyCredits > 0) {
        await setCredits(userId, monthlyCredits)
      }
    }

    return NextResponse.json({ received: true })
  } catch (err) {
    console.error("Webhook processing error:", err)
    return new NextResponse("Webhook error", { status: 500 })
  }
}
