import { NextResponse } from "next/server"
import Stripe from "stripe"
import { createClient } from "@supabase/supabase-js"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
 
})

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // REQUIRED
)

export async function POST(req: Request) {
  const body = await req.text()
  const signature = req.headers.get("stripe-signature")

  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 })
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err: any) {
    return NextResponse.json(
      { error: `Webhook Error: ${err.message}` },
      { status: 400 }
    )
  }

  try {
    /* ----------------------------------------
       1️⃣ ONE-TIME CREDIT PACK PURCHASE
    ---------------------------------------- */
    if (event.type === "checkout.session.completed") {
  const session = event.data.object as Stripe.Checkout.Session

  /* -------------------------------
     SUBSCRIPTION: attach metadata
  -------------------------------- */
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

  /* -------------------------------
     ONE-TIME CREDIT PACK
  -------------------------------- */
  const userId = session.metadata?.userId
  const credits = Number(session.metadata?.credits)

  if (userId && credits) {
    await addCredits(userId, credits)
  }
}

    /* ----------------------------------------
       2️⃣ SUBSCRIPTION RENEWALS (PRO / ELITE)
    ---------------------------------------- */
    if (event.type === "invoice.payment_succeeded") {
      const invoice = event.data.object as Stripe.Invoice

      if (!invoice.subscription) {
        return NextResponse.json({ received: true })
      }

      const subscription = await stripe.subscriptions.retrieve(
        invoice.subscription as string
      )

      const userId = subscription.metadata?.userId
      const plan = subscription.metadata?.plan

      if (!userId || !plan) {
        return NextResponse.json({ received: true })
      }

      const credits =
        plan === "pro" ? 200 :
        plan === "elite" ? 500 : 0

      if (credits > 0) {
        await addCredits(userId, credits)
      }
    }

    return NextResponse.json({ received: true })
  } catch (err) {
    console.error("Webhook handler failed:", err)
    return NextResponse.json({ error: "Webhook failed" }, { status: 500 })
  }
}

/* ----------------------------------------
   CREDIT HANDLER (SAFE + IDPOTENT)
---------------------------------------- */
async function addCredits(userId: string, amount: number) {
  const { data } = await supabase
    .from("user_credits")
    .select("credits")
    .eq("user_id", userId)
    .single()

  if (!data) {
    await supabase.from("user_credits").insert({
      user_id: userId,
      credits: amount,
    })
  } else {
    await supabase
      .from("user_credits")
      .update({ credits: data.credits + amount })
      .eq("user_id", userId)
  }
}
