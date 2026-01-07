import Stripe from "stripe";
import { headers } from "next/headers";
import { createClient } from "@supabase/supabase-js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
 
});

// IMPORTANT: service role key (server-only)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// 🔒 Required for Stripe signature verification
export const runtime = "nodejs";

export async function POST(req: Request) {
  const body = await req.text();
  const sig = headers().get("stripe-signature");

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig!,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    console.error("❌ Stripe signature verification failed:", err.message);
    return new Response("Webhook Error", { status: 400 });
  }

  // ✅ ONLY handle invoice.paid
  if (event.type !== "invoice.paid") {
    return new Response("ignored", { status: 200 });
  }

  const invoice = event.data.object as Stripe.Invoice;

  /**
   * 1️⃣ Resolve Supabase user_id
   * REQUIRED: user_id must exist in Stripe metadata
   */
  const userId = invoice.metadata?.user_id;
  if (!userId) {
    console.error("❌ Missing user_id in Stripe metadata");
    return new Response("Missing user_id", { status: 400 });
  }

  /**
   * 2️⃣ Determine credits from Stripe PRICE ID
   * Replace these with YOUR real Stripe price IDs
   */
  const priceId =(invoice.lines.data[0]as any)?.price?.id;

  const CREDITS_BY_PRICE: Record<string, number> = {
    "price_1SmO6tRYoDtZ3J2YUjVeOB6O", 300
    "price_1SmO6ARYoDtZ3J2YqTQWIznT", 600
  };

  const creditsToAdd = CREDITS_BY_PRICE[priceId!];
  if (!creditsToAdd) {
 O
   console.error("❌ Unknown Stripe price ID:", priceId);
    return new Response("Unknown price", { status: 400 });
  }

  /**
   * 3️⃣ Increment credits via RPC (IDEMPOTENT)
   */
  const { error } = await supabase.rpc("increment_user_credits", {
    p_user_id: userId,
    p_amount: creditsToAdd,
    p_reason: "stripe_invoice_paid",
    p_stripe_event_id: event.id,
  });

  if (error) {
    console.error("❌ Supabase RPC error:", error);
    return new Response("Database error", { status: 500 });
  }

  // ✅ SUCCESS — Stripe will NOT retry
  return new Response("ok", { status: 200 });
}
