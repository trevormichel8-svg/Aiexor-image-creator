import { consumeCredit, getCredits } from '@/lib/credits'
import { NextRequest, NextResponse } from "next/server"
import { imageRequestSchema } from "@/lib/validation"
import { generateImage } from "@/lib/generateImage"
import { rateLimit } from "@/lib/rateLimit"
import { compilePrompt } from "@/lib/promptCompiler"


export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for") ?? "unknown"

  if (!rateLimit(ip)) {
    return NextResponse.json({ credits: getCredits(), { error: "Too many requests" }, { status: 429 })
  }

  const body = await req.json()
  const parsed = imageRequestSchema.safeParse(body)

  if (!parsed.success) {
    return NextResponse.json({ credits: getCredits(), { error: "Invalid input" }, { status: 400 })
  }

  // Destructure the validated values. We compile the prompt here using the
  // provided style and strength so the client doesn't have to worry about
  // concatenating style descriptors or weighting the influence themselves.
  const { prompt, style, strength } = parsed.data

  
try {
  if (!consumeCredit()) {
    return NextResponse.json({ credits: getCredits(), { error: 'Out of credits', credits: getCredits() }, { status: 402 })
  }

  if (!body?.prompt || body.prompt.trim().length < 3) {
    return NextResponse.json({ credits: getCredits(), { error: "Prompt too short" }, { status: 400 })
  }

    const compiledPrompt = compilePrompt(prompt, style, strength)
    const imageUrl = await generateImage(compiledPrompt)

    return NextResponse.json({ credits: getCredits(), { imageUrl })
  } catch {
    return NextResponse.json({ credits: getCredits(), { error: (process.env.NODE_ENV==="development" ? String(err) : "Generation failed") }, { status: 500 })
  }
}
