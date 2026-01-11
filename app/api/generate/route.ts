import { NextResponse } from "next/server"

let DAILY_FREE_LIMIT = 5

// in-memory demo counter (replace later with Supabase)
const usage = new Map<string, number>()

export async function POST(req: Request) {
  try {
    const { prompt, style } = await req.json()

    if (!prompt) {
      return NextResponse.json({ error: "Missing prompt" }, { status: 400 })
    }

    // demo user (replace with auth later)
    const userId = "free-user"

    const used = usage.get(userId) ?? 0

    if (used >= DAILY_FREE_LIMIT) {
      return NextResponse.json(
        { error: "Daily free limit reached" },
        { status: 403 }
      )
    }

    usage.set(userId, used + 1)

    const finalPrompt = `${prompt}, ${style} style`

    // 🔥 Placeholder image (safe & stable)
    const image = `https://picsum.photos/seed/${encodeURIComponent(
      finalPrompt
    )}/512/512`

    return NextResponse.json({
      image,
      prompt: finalPrompt,
      watermarked: true,
      creditsLeft: DAILY_FREE_LIMIT - (used + 1),
    })
  } catch (e) {
    return NextResponse.json({ error: "Generation failed" }, { status: 500 })
  }
}
