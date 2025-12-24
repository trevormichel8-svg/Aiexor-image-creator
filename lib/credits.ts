import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export function getCreditsClient() {
  return createServerComponentClient({
    cookies: () => cookies(),
  });
}
