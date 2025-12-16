
import Stripe from "stripe";
import { headers } from "next/headers";
import { createClient } from "@supabase/supabase-js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: "2023-10-16" });

export async function POST(req: Request) {
  const body = await req.text();
  const sig = headers().get("stripe-signature")!;

  const event = stripe.webhooks.constructEvent(
    body,
    sig,
    process.env.STRIPE_WEBHOOK_SECRET!
  );

  if (event.type !== "checkout.session.completed") {
    return new Response("OK");
  }

  const session: any = event.data.object;

  const creditsMap: any = {
    [process.env.STRIPE_PRICE_STARTER!]: 20,
    [process.env.STRIPE_PRICE_PRO!]: 70,
    [process.env.STRIPE_PRICE_STUDIO!]: 180,
  };

  const credits = creditsMap[session.metadata.priceId];

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  await supabase.rpc("increment_credits", {
    amount: credits,
    user_id: session.metadata.userId,
  });

  await supabase.from("credit_transactions").insert({
    user_id: session.metadata.userId,
    amount: credits,
    reason: "Stripe purchase",
  });

  return new Response("OK");
}
