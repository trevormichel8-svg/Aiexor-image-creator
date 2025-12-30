import OpenAI from "openai";
import { NextResponse } from "next/server";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();

    const result = await openai.images.generate({
      model: "gpt-image-1",
      prompt,
    });

    if (!result.data?.[0]?.b64_json) {
      throw new Error("No image returned");
    }

    return NextResponse.json({
      image: result.data[0].b64_json,
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Generation failed" }, { status: 500 });
  }
}
