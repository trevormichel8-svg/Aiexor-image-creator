
import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  const { prompt, provider, modelId } = await req.json();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { cookies: { getAll: () => cookies().getAll() } }
  );

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: profile } = await supabase
    .from("profiles")
    .select("credits")
    .eq("id", user.id)
    .single();

  if (!profile || profile.credits < 2)
    return NextResponse.json({ error: "Not enough credits" }, { status: 402 });

  // Replace this with your real image generation logic
  const imageUrl = "https://placehold.co/1024x1024/png";

  await supabase
    .from("profiles")
    .update({ credits: profile.credits - 2 })
    .eq("id", user.id);

  await supabase.from("images").insert({
    user_id: user.id,
    image_url: imageUrl,
    prompt,
    model: modelId,
    provider,
    is_public: true,
    is_free: profile.credits - 2 < 2,
  });

  return NextResponse.json({ image: imageUrl });
}
