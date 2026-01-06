import { supabaseServer } from "@/lib/supabase/server";

export async function getUserById(userId: string) {
  const supabase = supabaseServer();

  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("id", userId)
    .single();

  if (error) throw error;
  return data;
}
