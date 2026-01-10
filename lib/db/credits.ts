import { createServerClient } from "@/supabase/server";

export async function consumeUserCredit(userId: string): Promise<number> {
  const supabase = createServerClient();

  const { data, error } = await supabase.rpc("consume_credit", {
    user_id: userId,
  });

  if (error) {
    if (error.message.includes("NO_CREDITS")) {
      throw new Error("INSUFFICIENT_CREDITS");
    }
    throw error;
  }

  return data;
}
