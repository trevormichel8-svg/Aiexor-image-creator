import { supabaseServer } from "@/lib/supabase/server";

export async function getUserPlan(userId: string) {
  const supabase = supabaseServer();

  const { data, error } = await supabase
    .from("subscriptions")
    .select("plan,status")
    .eq("user_id", userId)
    .eq("status", "active")
    .single();

  if (error) return null;
  return data;
}
