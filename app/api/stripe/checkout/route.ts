import { NextRequest, NextResponse } from "next/server"
import { stripe, PRICES } from "@/lib/stripe"

export async function POST(req: NextRequest) {
  const { pack, userId } = await req.json()

  const price = PRICES[pack]
  if (!price) {
    return NextResponse.json({ error: "Invalid pack" }, { status: 400 })
  }

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: { name: `${price.credits} Credits` },
          unit_amount: price.amount,
        },
        quantity: 1,
      },
    ],
    metadata: { user_id: userId, pack },
    success_url: `${process.env.NEXT_PUBLIC_SITE_URL}`,
    cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}`,
  })

  return NextResponse.json({ url: session.url })
}
