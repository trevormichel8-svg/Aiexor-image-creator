import { supabaseServer } from "./supabaseServer"

export async function getCredits(userId: string) {
  const supabase = supabaseServer()

  const { data } = await supabase
    .from("users")
    .select("credits")
    .eq("id", userId)
    .single()

  return data?.credits ?? 0
}

export async function ensureUser(userId: string) {
  const supabase = supabaseServer()

  await supabase.from("users").upsert({
    id: userId,
    credits: 0,
  })
}

export async function addCredits(userId: string, amount: number) {
  const supabase = supabaseServer()

  await supabase.rpc("increment_credits", {
    user_id: userId,
    amount,
  })
}

export async function consumeCredit(userId: string) {
  const supabase = supabaseServer()

  const { data } = await supabase
    .from("users")
    .select("credits")
    .eq("id", userId)
    .single()

  if (!data || data.credits < 1) return false

  await supabase
    .from("users")
    .update({ credits: data.credits - 1 })
    .eq("id", userId)

  return true
}
