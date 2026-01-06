import { NextResponse } from "next/server"
import OpenAI from "openai"
import { cookies } from "next/headers"
import { supabaseServer } from "@/lib/supabaseServer"

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

    // 🔐 Read Supabase session from cookies
    const cookieStore = cookies()
    const accessToken = cookieStore.get("sb-access-token")?.value

    if (!accessToken) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      )
    }

    const supabase = supabaseServer()

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser(accessToken)

    if (userError || !user) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      )
    }

    // 💳 Get credits
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
    const image = await openai.images.generate({
      model: "gpt-image-1",
      prompt,
      size: "1024x1024",
    })

    const imageUrl = image.data[0].url

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
    console.error("IMAGE GENERATE ERROR:", err)
    return NextResponse.json(
      { error: "Image generation failed" },
      { status: 500 }
    )
  }
}
