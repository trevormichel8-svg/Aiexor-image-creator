import { NextResponse } from "next/server";
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export async function POST(req: Request) {
  const { prompt } = await req.json();

  const result = await client.images.generate({
    model: "gpt-image-1",
    prompt,
    size: "1024x1024",
  });

  return NextResponse.json({
    image: result.data[0].url,
  });
}
