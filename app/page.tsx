"use client"

import { useEffect, useState } from "react"
import { createClient } from "@supabase/supabase-js"
import BuySubscription from "@/components/BuySubscription"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function Page() {
  const [user, setUser] = useState<any>(null)
  const [credits, setCredits] = useState<number | null>(null)

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user)
      if (data.user) loadCredits(data.user.id)
    })

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null)
        if (session?.user) loadCredits(session.user.id)
        else setCredits(null)
      }
    )

    return () => {
      listener.subscription.unsubscribe()
    }
  }, [])

  const loadCredits = async (userId: string) => {
    const { data } = await supabase
      .from("user_credits")
      .select("credits")
      .eq("user_id", userId)
      .single()

    setCredits(data?.credits ?? 0)
  }

  const signIn = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
    })
  }

  const signOut = async () => {
    await supabase.auth.signOut()
  }

  return (
    <main style={{ padding: 20 }}>
      {/* Top bar */}
      <div style={{ display: "flex", gap: 12, marginBottom: 20 }}>
        {!user ? (
          <button onClick={signIn}>Sign in</button>
        ) : (
          <>
            <span>Credits: {credits ?? "…"}</span>
            <button onClick={signOut}>Sign out</button>
          </>
        )}
      </div>

      <h1>Create Your First Image</h1>

      {/* Subscription section */}
      {user ? (
        <BuySubscription />
      ) : (
        <p>Please sign in to buy a subscription.</p>
      )}
    </main>
  )
}
