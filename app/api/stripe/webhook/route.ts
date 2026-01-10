import Stripe from "stripe";
import { headers } from "next/headers";
import { createServerClient } from "@/supabase/server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16",
});

export async function POST(req: Request) {
  const body = await req.text();
  const signature = headers().get("stripe-signature")!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch {
    return new Response("Invalid signature", { status: 400 });
  }

  const supabase = createServerClient();

  const { error: seenError } = await supabase
    .from("stripe_events")
    .insert({ id: event.id });

  if (seenError) {
    return new Response("Event already processed", { status: 200 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const userId = session.metadata?.userId;

    if (!userId) {
      return new Response("Missing userId", { status: 400 });
    }

    await supabase.rpc("add_credits", {
      user_id: userId,
      amount: 10,
    });
  }

  return new Response("OK", { status: 200 });
}
