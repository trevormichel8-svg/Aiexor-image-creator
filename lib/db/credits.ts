import { supabaseServer } from "@/lib/supabase/server";

export async function getUserCredits(userId: string) {
  const supabase = supabaseServer();

  const { data, error } = await supabase
    .from("user_credits")
    .select("credits")
    .eq("user_id", userId)
    .single();

  if (error) throw error;
  return data.credits;
}

export async function deductCredits(userId: string, amount: number) {
  const supabase = supabaseServer();

  const { error } = await supabase.rpc("deduct_credits", {
    p_user_id: userId,
    p_amount: amount,
  });

  if (error) throw error;
}
