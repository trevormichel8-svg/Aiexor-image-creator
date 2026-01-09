import { NextResponse } from "next/server";
import OpenAI from "openai";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export async function POST(req: Request) {
  const body = await req.json();
  const {
    prompt,
    style,
    aspect_ratio,
    quality,
    mode = "generate", // "generate" | "variation"
  } = body;

  const cookieStore = cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { cookies: { get: (name) => cookieStore.get(name)?.value } }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const imagesToGenerate = mode === "variation" ? 4 : 1;
  const results: string[] = [];

  for (let i = 0; i < imagesToGenerate; i++) {
    

    const result = await openai.images.generate({
      model: "gpt-image-1",
      prompt: `${prompt}, style: ${style}`,
      size:
        aspect_ratio === "16:9"
          ? "1792x1024"
          : aspect_ratio === "9:16"
          ? "1024x1792"
          : "1024x1024",
      quality: quality === "ultra" ? "high" : "standard",
       });

    const imageUrl = result.data[0].url!;
    results.push(imageUrl);

    await supabase.from("images").insert({
      user_id: user.id,
      image_url: imageUrl,
      prompt,
      style,
      aspect_ratio,
      quality,
      });
  }

  return NextResponse.json({ images: results });
}
