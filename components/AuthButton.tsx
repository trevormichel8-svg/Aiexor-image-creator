"use client"

import { supabase } from "@/lib/supabase"
import { useEffect, useState } from "react"

export default function AuthButton() {
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  async function signIn() {
    await supabase.auth.signInWithOAuth({
      provider: "google",
    })
  }

  async function signOut() {
    await supabase.auth.signOut()
  }

  return user ? (
    <button onClick={signOut} className="teal-glow-btn">
      Sign out
    </button>
  ) : (
    <button onClick={signIn} className="teal-glow-btn">
      Sign in
    </button>
  )
}
