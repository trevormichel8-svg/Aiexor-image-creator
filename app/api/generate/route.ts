import { NextRequest, NextResponse } from "next/server"
import { imageRequestSchema } from "@/lib/validation"
import { generateImage } from "@/lib/generateImage"
import { rateLimit } from "@/lib/rateLimit"

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for") ?? "unknown"

  if (!rateLimit(ip)) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 })
  }

  const body = await req.json()
  const parsed = imageRequestSchema.safeParse(body)

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 })
  }

  try {
    const imageUrl = await generateImage(
      `${parsed.data.prompt}, ${parsed.data.style}`
    )

    return NextResponse.json({ imageUrl })
  } catch {
    return NextResponse.json({ error: "Generation failed" }, { status: 500 })
  }
}
