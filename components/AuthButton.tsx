"use client"

import { useEffect, useState } from "react"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function AuthButton() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user)
      setLoading(false)
    })

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null)
      }
    )

    return () => {
      listener.subscription.unsubscribe()
    }
  }, [])

  if (loading) return null

  if (!user) {
    return (
      <button
        onClick={() =>
          supabase.auth.signInWithOAuth({ provider: "google" })
        }
        className="
          px-4 py-2 rounded-full
          bg-teal-600 text-black font-medium
          shadow-[0_0_16px_rgba(45,212,191,0.6)]
          hover:bg-teal-500 transition
        "
      >
        Sign In
      </button>
    )
  }

  return (
    <button
      onClick={() => supabase.auth.signOut()}
      className="
        px-4 py-2 rounded-full
        border border-teal-500/40
        text-teal-300
        hover:bg-teal-500/10
        shadow-[0_0_12px_rgba(45,212,191,0.4)]
      "
    >
      Sign Out
    </button>
  )
}
