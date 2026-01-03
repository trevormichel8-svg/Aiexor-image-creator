import { NextRequest, NextResponse } from "next/server"
import { stripe, PRICES } from "@/lib/stripe"
import { supabaseServer } from "@/lib/supabaseServer"

export async function POST(req: NextRequest) {
  const { plan } = await req.json()

  const price = PRICES[plan as keyof typeof PRICES]
  if (!price) {
    return NextResponse.json({ error: "Invalid plan" }, { status: 400 })
  }

  const supabase = supabaseServer()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    payment_method_types: ["card"],
    customer_email: user.email ?? undefined,
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: `${price.credits} AI Credits`,
          },
          unit_amount: price.amount,
        },
        quantity: 1,
      },
    ],
    metadata: {
      userId: user.id,
      credits: String(price.credits),
    },
    success_url: `${process.env.NEXT_PUBLIC_SITE_URL}?success=1`,
    cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}?canceled=1`,
  })

  return NextResponse.json({ url: session.url })
}
