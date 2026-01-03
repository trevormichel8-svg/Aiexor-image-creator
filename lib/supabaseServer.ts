import { createServerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"

export function supabaseServer() {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!, // server-only
    { cookies }
  )
}
