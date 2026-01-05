import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { createServerClient } from "@supabase/ssr"
import OpenAI from "openai"

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
})

export async function POST(req: Request) {
  try {
    const { prompt, style, strength } = await req.json()

    if (!prompt || typeof prompt !== "string") {
      return NextResponse.json({ error: "Missing prompt" }, { status: 400 })
    }

    // ✅ Supabase (SERVER-SIDE AUTH)
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { cookies }
    )

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { error: "Please sign in first" },
        { status: 401 }
      )
    }

    // ✅ CHECK CREDITS
    const { data: creditRow, error: creditError } = await supabase
      .from("user_credits")
      .select("credits")
      .eq("user_id", user.id)
      .single()

    if (creditError || !creditRow || creditRow.credits <= 0) {
      return NextResponse.json(
        { error: "Not enough credits" },
        { status: 402 }
      )
    }

    // ✅ GENERATE IMAGE
    const fullPrompt = style
      ? `${prompt}, style: ${style}`
      : prompt

    const result = await openai.images.generate({
      model: "gpt-image-1",
      prompt: fullPrompt,
      size: "1024x1024",
    })

    const imageUrl = result.data[0]?.url

    if (!imageUrl) {
      return NextResponse.json(
        { error: "Image generation failed" },
        { status: 500 }
      )
    }

    // ✅ DEDUCT 1 CREDIT (ATOMIC UPDATE)
    const { error: updateError } = await supabase
      .from("user_credits")
      .update({ credits: creditRow.credits - 1 })
      .eq("user_id", user.id)

    if (updateError) {
      return NextResponse.json(
        { error: "Failed to update credits" },
        { status: 500 }
      )
    }

    return NextResponse.json({
      imageUrl,
      remainingCredits: creditRow.credits - 1,
    })
  } catch (err) {
    console.error("Generate error:", err)
    return NextResponse.json(
      { error: "Unexpected server error" },
      { status: 500 }
    )
  }
}
