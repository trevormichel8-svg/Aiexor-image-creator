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
      return NextResponse.json({ error: "Missing prompt or user" }, { status: 400 })
    }

    /* ---------------------------------------------------
       1️⃣ GET USER PLAN + CREDITS
    --------------------------------------------------- */
    const { data: creditRow } = await supabase
      .from("user_credits")
      .select("credits, plan")
      .eq("user_id", userId)
      .single()

    const plan = creditRow?.plan ?? "free"
    const credits = creditRow?.credits ?? 0

    /* ---------------------------------------------------
       2️⃣ FREE DAILY LIMIT (DALL·E)
    --------------------------------------------------- */
    if (plan === "free") {
      const today = new Date().toISOString().slice(0, 10)

      const { count } = await supabase
        .from("image_generations")
        .select("*", { count: "exact", head: true })
        .eq("user_id", userId)
        .eq("day", today)

      if ((count ?? 0) >= FREE_DAILY_LIMIT) {
        return NextResponse.json(
          { error: "Daily free limit reached" },
          { status: 403 }
        )
      }
    }

    /* ---------------------------------------------------
       3️⃣ GENERATE IMAGE
    --------------------------------------------------- */
    const image = await openai.images.generate({
      model: "gpt-image-1", // DALL·E equivalent
      prompt,
      size: "1024x1024",
    })

    const imageBase64 = image.data[0].b64_json
    let imageBuffer = Buffer.from(imageBase64, "base64")

    /* ---------------------------------------------------
       4️⃣ APPLY WATERMARK (FREE USERS ONLY)
    --------------------------------------------------- */
    if (plan === "free") {
      const watermark = Buffer.from(
        `<svg width="1024" height="1024">
          <text x="98%" y="98%"
            font-size="32"
            fill="white"
            fill-opacity="0.35"
            text-anchor="end"
            font-family="Arial, sans-serif">
            Aiexor • Free Preview
          </text>
        </svg>`
      )

      imageBuffer = await (imageBuffer)
        .composite([{ input: watermark, gravity: "southeast" }])
        .png()
        .toBuffer()
    }

    /* ---------------------------------------------------
       5️⃣ LOG GENERATION
    --------------------------------------------------- */
    await supabase.from("image_generations").insert({
      user_id: userId,
      day: new Date().toISOString().slice(0, 10),
      plan,
    })

    /* ---------------------------------------------------
       6️⃣ DEDUCT CREDIT (PAID ONLY)
    --------------------------------------------------- */
    if (plan !== "free") {
      if (credits <= 0) {
        return NextResponse.json(
          { error: "Out of credits" },
          { status: 403 }
        )
      }

      await supabase
        .from("user_credits")
        .update({ credits: credits - 1 })
        .eq("user_id", userId)
    }

    return new NextResponse(imageBuffer, {
      headers: {
        "Content-Type": "image/png",
      },
    })
  } catch (err) {
    console.error("IMAGE GEN ERROR:", err)
    return NextResponse.json({ error: "Failed to generate image" }, { status: 500 })
  }
}
