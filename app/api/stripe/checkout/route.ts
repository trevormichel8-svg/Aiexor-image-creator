import { NextResponse } from "next/server"
import Stripe from "stripe"
import { cookies } from "next/headers"
import { createServerClient } from "@supabase/ssr"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  
})

export async function POST(req: Request) {
  try {
    const { credits } = await req.json()

    if (!credits) {
      return NextResponse.json(
        { error: "Missing credits" },
        { status: 400 }
      )
    }

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        cookies: {
          get(name) {
            return cookies().get(name)?.value
          },
        },
      }
    )

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      )
    }

    const priceMap: Record<number, number> = {
      20: 699,
      50: 1399,
      100: 2499,
    }

    const amount = priceMap[credits]

    if (!amount) {
      return NextResponse.json(
        { error: "Invalid credit pack" },
        { status: 400 }
      )
    }

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: `${credits} Credits`,
            },
            unit_amount: amount,
          },
          quantity: 1,
        },
      ],
      metadata: {
        userId: user.id,
        credits: credits.toString(),
      },
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/?cancelled=true`,
    })

    return NextResponse.json({ url: session.url })
  } catch (err) {
    console.error("Checkout error:", err)
    return NextResponse.json(
      { error: "Stripe checkout failed" },
      { status: 500 }
    )
  }
}
