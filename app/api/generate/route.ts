import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import OpenAI from "openai"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
})

const FREE_DAILY_LIMIT = 5

export async function POST(req: Request) {
  try {
    const { prompt, userId } = await req.json()

    if (!prompt || !userId) {
      return NextResponse.json(
        { error: "Missing prompt or userId" },
        { status: 400 }
      )
    }

    // 1️⃣ Fetch user credit state
    const { data: creditsRow, error } = await supabase
      .from("user_credits")
      .select("credits, free_daily_used, free_daily_date")
      .eq("user_id", userId)
      .single()

    if (error || !creditsRow) {
      return NextResponse.json(
        { error: "Credits record not found" },
        { status: 404 }
      )
    }

    const today = new Date().toISOString().slice(0, 10)

    let paidCredits = creditsRow.credits ?? 0
    let freeUsed = creditsRow.free_daily_used ?? 0
    let freeDate = creditsRow.free_daily_date

    // 2️⃣ Reset free counter if new day
    if (freeDate !== today) {
      freeUsed = 0
      freeDate = today
    }

    // 3️⃣ Decide generation tier
    let tier: "paid" | "free"

    if (paidCredits > 0) {
      tier = "paid"
    } else if (freeUsed < FREE_DAILY_LIMIT) {
      tier = "free"
    } else {
      return NextResponse.json(
        { error: "daily_limit_reached" },
        { status: 402 }
      )
    }

    // 4️⃣ Generate image
    const image = await openai.images.generate({
      model: "gpt-image-1",
      prompt,
      size: tier === "free" ? "512x512" : "1024x1024",
      quality: tier === "free" ? "standard" : "high",
    })

    const imageUrl = image.data[0]?.url

    if (!imageUrl) {
      return NextResponse.json(
        { error: "Image generation failed" },
        { status: 500 }
      )
    }

    // 5️⃣ Update credits
    if (tier === "paid") {
      await supabase
        .from("user_credits")
        .update({ credits: paidCredits - 1 })
        .eq("user_id", userId)
    } else {
      await supabase
        .from("user_credits")
        .update({
          free_daily_used: freeUsed + 1,
          free_daily_date: freeDate,
        })
        .eq("user_id", userId)
    }

    return NextResponse.json({
      image: imageUrl,
      tier,
      remainingPaidCredits: tier === "paid" ? paidCredits - 1 : paidCredits,
      freeUsed: tier === "free" ? freeUsed + 1 : freeUsed,
      freeLimit: FREE_DAILY_LIMIT,
    })
  } catch (err) {
    console.error("❌ Image generation error:", err)
    return NextResponse.json(
      { error: "generation_failed" },
      { status: 500 }
    )
  }
}
