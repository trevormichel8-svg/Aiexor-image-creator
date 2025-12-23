  import { NextResponse } from "next/server";
import { experimental_generateImage } from "ai";
import { supabaseServer } from "@/lib/supabaseClient";
import { GenerateImagesSchema } from "@/lib/schemas/generate-images.schema";
import type { ImageModel } from "ai";

export const runtime = "edge";

/* ================================
   MODEL MAP
================================ */
const MODEL_MAP: Record<
  "openai",
  ImageModel
> = {
  openai: "gpt-image-1"
};

/* ================================
   POST
================================ */
export async function POST(req: Request) {
  const supabase = supabaseServer();

  /* 1️⃣ Validate request */
  const parsed = GenerateImagesSchema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const { prompt } = parsed.data;

  /* 2️⃣ Get user */
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  /* 3️⃣ Generate image */
  const result = await experimental_generateImage({
    model: MODEL_MAP,
    prompt,
    size: "1024x1024"
  });

  const base64Image = result.image.base64;

  /* 4️⃣ Upload image to Supabase Storage */
  const buffer = Buffer.from(base64Image, "base64");
  const filePath = `${user.id}/${Date.now()}.png`;

  const { error: uploadError } = await supabase.storage
    .from("generated-images")
    .upload(filePath, buffer, {
      contentType: "image/png"
    });

  if (uploadError) {
    console.error(uploadError);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }

  /* 5️⃣ Create signed URL (7 days) */
  const { data: signed } = await supabase.storage
    .from("generated-images")
    .createSignedUrl(filePath, 60 * 60 * 24 * 7);

  if (!signed?.signedUrl) {
    return NextResponse.json({ error: "URL failed" }, { status: 500 });
  }

  /* 6️⃣ Save metadata to DB */
  const { error: dbError } = await supabase.from("images").insert({
    user_id: user.id,
    prompt,
    model: MODEL_MAP,
    image_url: signed.signedUrl
  });

  if (dbError) {
    console.error(dbError);
    return NextResponse.json({ error: "DB insert failed" }, { status: 500 });
  }

  /* 7️⃣ Return image to client */
  return NextResponse.json({
    image: signed.signedUrl
  });
  }
    
