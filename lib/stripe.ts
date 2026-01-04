import Stripe from "stripe"

let stripe: Stripe | null = null

export function getStripe() {
  if (!stripe) {
    const key = process.env.STRIPE_SECRET_KEY
    if (!key) {
      throw new Error("STRIPE_SECRET_KEY is not set")
    }

    // IMPORTANT:
    // Do NOT pass apiVersion.
    // Stripe typings now enforce a future literal and will break builds.
    stripe = new Stripe(key)
  }

  return stripe
}

// Credit packages used by checkout + webhook
export const PRICES = {
  "20": { credits: 20, amount: 699 },   // $6.99
  "50": { credits: 50, amount: 1399 },  // $13.99
  "100": { credits: 100, amount: 2499 }, // $24.99
} as const
