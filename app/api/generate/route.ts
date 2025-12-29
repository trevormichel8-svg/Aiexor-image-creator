import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();

    const result = await openai.images.generate({
      model: "gpt-image-1",
      prompt,
      size: "1024x1024",
    });

    // ✅ Type-safe guard (this is the fix)
    if (!result.data || !result.data[0]?.b64_json) {
      throw new Error("No image data returned from OpenAI");
    }

    return NextResponse.json({
      image: result.data[0].b64_json,
    });
  } catch (err) {
    console.error("IMAGE ERROR:", err);
    return NextResponse.json(
      { error: "Image generation failed" },
      { status: 500 }
    );
  }
}
