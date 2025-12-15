import { NextResponse } from "next/server";
import { openai } from "@/lib/openai";

export async function POST(req: Request) {
  const { prompt, style } = await req.json();

  try {
    const fullPrompt = `${prompt}, style: ${style}`;

    const result = await openai.images.generate({
      model: "gpt-image-1",
      prompt: fullPrompt,
      size: "1024x1024",
    });

    return NextResponse.json({
      image: result.data[0].url,
    });
  } catch (err) {
    return NextResponse.json(
      { error: "Image generation failed" },
      { status: 500 }
    );
  }
}
  
