import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function requireCredits(cost: number) {
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies }
  );

  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    return { ok: false, error: "Not authenticated" };
  }

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("credits")
    .eq("id", user.id)
    .single();

  if (error || !profile) {
    return { ok: false, error: "Profile not found" };
  }

  if (profile.credits < cost) {
    return { ok: false, error: "Not enough credits" };
  }

  // Deduct credits atomically
  const { error: updateError } = await supabase
    .from("profiles")
    .update({ credits: profile.credits - cost })
    .eq("id", user.id);

  if (updateError) {
    return { ok: false, error: "Failed to deduct credits" };
  }

  return { ok: true, userId: user.id };
    }
            
