import Stripe from "stripe"

let stripe: Stripe | null = null

export function getStripe() {
  if (!stripe) {
    const key = process.env.STRIPE_SECRET_KEY
    if (!key) {
      throw new Error("STRIPE_SECRET_KEY is not set")
    }

    stripe = new Stripe(key, {
      apiVersion: "2023-10-16",
    })
  }

  return stripe
}

export const PRICES = {
  "20": { credits: 20, amount: 699 },
  "50": { credits: 50, amount: 1399 },
  "100": { credits: 100, amount: 2499 },
}
