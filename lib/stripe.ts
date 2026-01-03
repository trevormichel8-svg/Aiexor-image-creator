import Stripe from "stripe"

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export const PRICES = {
  "20": { credits: 20, amount: $6.99 },
  "50": { credits: 50, amount: $13.99 },
  "100": { credits: 100, amount: $24.99 },
}
