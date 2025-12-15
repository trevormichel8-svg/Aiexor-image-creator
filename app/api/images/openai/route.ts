import { experimental_generateImage } from "ai";
import { NextResponse } from "next/server";
import { z } from "zod";
import { requireCredits } from "@/lib/credits";

export const runtime = "edge";

// Simple request validation
const OpenAIImageSchema = z.object({
  prompt: z.string().min(3).max(500),
});

export async function POST(req: Request) {
  // ✅ Parse request
  const body = await req.json();
  const parsed = OpenAIImageSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid request", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  // ✅ Check credits (1 image = 1 credit)
  const credit = await requireCredits(1);

  if (!credit.ok) {
    return NextResponse.json(
      { error: credit.error },
      { status: credit.status }
    );
  }

  const { prompt } = parsed.data;

  // ✅ OpenAI image generation ONLY
  const image = await experimental_generateImage({
    model: "gpt-image-1",
    prompt,
    size: "1024x1024",
  });

  return NextResponse.json({ image });
  }
        
