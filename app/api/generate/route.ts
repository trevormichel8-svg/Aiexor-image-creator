import { NextRequest, NextResponse } from "next/server"
import { imageRequestSchema } from "@/lib/validation"
import { generateImage } from "@/lib/generateImage"
import { rateLimit } from "@/lib/rateLimit"
import { compilePrompt } from "@/lib/promptCompiler"
import { consumeCredit, getCredits, ensureUser } from "@/lib/credits"
import { supabaseServer } from "@/lib/supabaseServer"

export async function POST(req: NextRequest) {
  /* --------------------------------------------------
     1️⃣ Basic rate limiting (NO DB, NO AUTH)
  -------------------------------------------------- */
  const ip = req.headers.get("x-forwarded-for") ?? "unknown"

  if (!rateLimit(ip)) {
    return NextResponse.json(
      { error: "Too many requests" },
      { status: 429 }
    )
  }

  /* --------------------------------------------------
     2️⃣ Parse + validate request body
  -------------------------------------------------- */
  let body: unknown

  try {
    body = await req.json()
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON body" },
      { status: 400 }
    )
  }

  const parsed = imageRequestSchema.safeParse(body)

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid input" },
      { status: 400 }
    )
  }

  const { prompt, style, strength } = parsed.data

  if (!prompt || prompt.trim().length < 3) {
    return NextResponse.json(
      { error: "Prompt too short" },
      { status: 400 }
    )
  }

  /* --------------------------------------------------
     3️⃣ Auth check (REQUIRED from here on)
  -------------------------------------------------- */
  const supabase = supabaseServer()

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

  const userId = user.id

  /* --------------------------------------------------
     4️⃣ Ensure user row exists
  -------------------------------------------------- */
  await ensureUser(userId)

  /* --------------------------------------------------
     5️⃣ Consume credit (atomic logic)
  -------------------------------------------------- */
  const hasCredit = await consumeCredit(userId)

  if (!hasCredit) {
    const credits = await getCredits(userId)
    return NextResponse.json(
      { error: "Out of credits", credits },
      { status: 402 }
    )
  }

  /* --------------------------------------------------
     6️⃣ Generate image
  -------------------------------------------------- */
  try {
    const compiledPrompt = compilePrompt(prompt, style, strength)
    const imageUrl = await generateImage(compiledPrompt)

    const credits = await getCredits(userId)

    return NextResponse.json({
      imageUrl,
      credits,
    })
  } catch (err) {
    // If generation fails, refund the credit (optional safety)
    // You can remove this if you don’t want refunds
    // await addCredits(userId, 1)

    return NextResponse.json(
      {
        error:
          process.env.NODE_ENV === "development"
            ? String(err)
            : "Generation failed",
      },
      { status: 500 }
    )
  }
}
