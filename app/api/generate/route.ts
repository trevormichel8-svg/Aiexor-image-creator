import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { createServerClient } from "@supabase/ssr"
import OpenAI from "openai"

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
})

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { prompt, style } = body

    if (!prompt) {
      return NextResponse.json({ error: "Missing prompt" }, { status: 400 })
    }

    // ✅ CORRECT COOKIE ADAPTER (THIS IS THE FIX)
    const cookieStore = cookies()

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value
          },
        },
      }
    )

    const { data, error: authError } = await supabase.auth.getUser()

    if (authError || !data.user) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      )
    }

    const userId = data.user.id

    // ✅ CHECK CREDITS
    const { data: creditRow } = await supabase
      .from("user_credits")
      .select("credits")
      .eq("user_id", userId)
      .single()

    if (!creditRow || creditRow.credits <= 0) {
      return NextResponse.json(
        { error: "Not enough credits" },
        { status: 402 }
      )
    }

    // ✅ GENERATE IMAGE
    const fullPrompt = style ? `${prompt}, ${style}` : prompt

    const image = await openai.images.generate({
      model: "gpt-image-1",
      prompt: fullPrompt,
      size: "1024x1024",
    })

    const imageUrl = image.data[0]?.url

    if (!imageUrl) {
      return NextResponse.json(
        { error: "Generation failed" },
        { status: 500 }
      )
    }

    // ✅ DEDUCT CREDIT
    await supabase
      .from("user_credits")
      .update({ credits: creditRow.credits - 1 })
      .eq("user_id", userId)

    return NextResponse.json({
      imageUrl,
      remainingCredits: creditRow.credits - 1,
    })
  } catch (err) {
    console.error("Generate error:", err)
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    )
  }
}
