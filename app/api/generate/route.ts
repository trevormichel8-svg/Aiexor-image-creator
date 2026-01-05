import { NextResponse } from "next/server"
import OpenAI from "openai"
import { supabaseServerAuth } from "@/lib/supabaseServerAuth"

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
})

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json()

    if (!prompt || prompt.trim().length === 0) {
      return NextResponse.json(
        { error: "Missing prompt" },
        { status: 400 }
      )
    }

    // 🔐 Auth (cookie-based)
    const supabase = supabaseServerAuth()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      )
    }

    // 💳 Get user credits
    const { data: creditRow } = await supabase
      .from("user_credits")
      .select("credits")
      .eq("user_id", user.id)
      .single()

    const credits = creditRow?.credits ?? 0

    if (credits <= 0) {
      return NextResponse.json(
        { error: "No credits remaining" },
        { status: 402 }
      )
    }

    // 🎨 Generate image
    const result = await openai.images.generate({
      model: "gpt-image-1",
      prompt,
      size: "1024x1024",
    })

    const imageUrl = result.data[0].url

    // ➖ Deduct 1 credit
    const remainingCredits = credits - 1

    await supabase
      .from("user_credits")
      .update({ credits: remainingCredits })
      .eq("user_id", user.id)

    return NextResponse.json({
      imageUrl,
      remainingCredits,
    })
  } catch (err) {
    console.error("IMAGE GENERATION ERROR:", err)
    return NextResponse.json(
      { error: "Image generation failed" },
      { status: 500 }
    )
  }
}
