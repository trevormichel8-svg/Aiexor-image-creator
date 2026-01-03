import Stripe from 'stripe'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export const PRICES = {
  '20': { credits: 20, amount: 699 },
  '50': { credits: 50, amount: 1399 },
  '100': { credits: 100, amount: 2499 }
}
