import { consumeCredit, getCredits } from "@/lib/credits"
import { NextRequest, NextResponse } from "next/server"
import { imageRequestSchema } from "@/lib/validation"
import { generateImage } from "@/lib/generateImage"
import { rateLimit } from "@/lib/rateLimit"
import { compilePrompt } from "@/lib/promptCompiler"

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for") ?? "unknown"

  // Rate limit
  if (!rateLimit(ip)) {
    return NextResponse.json(
      { error: "Too many requests", credits: getCredits() },
      { status: 429 }
    )
  }

  const body = await req.json()
  const parsed = imageRequestSchema.safeParse(body)

  // Input validation
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid input", credits: getCredits() },
      { status: 400 }
    )
  }

  const { prompt, style, strength } = parsed.data

  try {
    // Credit check
    if (!(await consumeCredit())) {
      return NextResponse.json(
        { error: "Out of credits", credits: await getCredits() },
        { status: 402 }
      )
    }

    // Defensive prompt length check
    if (!prompt || prompt.trim().length < 3) {
      return NextResponse.json(
        { error: "Prompt too short", credits: getCredits() },
        { status: 400 }
      )
    }

    const compiledPrompt = compilePrompt(prompt, style, strength)
    const imageUrl = await generateImage(compiledPrompt)

    return NextResponse.json({
      imageUrl,
      credits: getCredits(),
    })
  } catch (err) {
    return NextResponse.json(
      {
        error:
          process.env.NODE_ENV === "development"
            ? String(err)
            : "Generation failed",
        credits: getCredits(),
      },
      { status: 500 }
    )
  }
}
