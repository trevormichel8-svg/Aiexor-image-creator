import { supabaseServer } from "./supabaseServer"

export async function getCredits() {
  const supabase = supabaseServer()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return 0

  const { data } = await supabase
    .from("users")
    .select("credits")
    .eq("id", user.id)
    .single()

  return data?.credits ?? 0
}

export async function consumeCredit() {
  const supabase = supabaseServer()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return false

  const { data } = await supabase
    .from("users")
    .select("credits")
    .eq("id", user.id)
    .single()

  if (!data || data.credits < 1) return false

  await supabase
    .from("users")
    .update({ credits: data.credits - 1 })
    .eq("id", user.id)

  return true
}

export async function addCredits(n: number) {
  const supabase = supabaseServer()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return

  await supabase.rpc("increment_credits", {
    uid: user.id,
    amount: n,
  })
}
