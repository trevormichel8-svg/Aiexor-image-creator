import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { prompt, style } = body;

    if (!prompt) {
      return NextResponse.json(
        { error: "Missing prompt" },
        { status: 400 }
      );
    }

    const finalPrompt = style
      ? `${prompt}, ${style}`
      : prompt;

    const result = await openai.images.generate({
      model: "gpt-image-1", // ✅ WORKS
      prompt: finalPrompt,
      size: "1024x1024",
    });

    const imageBase64 = result.data[0].b64_json;

    return NextResponse.json({
      image: `data:image/png;base64,${imageBase64}`,
    });
  } catch (error: any) {
    console.error("IMAGE GENERATION ERROR:", error);

    return NextResponse.json(
      {
        error: "Image generation failed",
        details: error?.message ?? "Unknown error",
      },
      { status: 500 }
    );
  }
}
