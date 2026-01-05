"use client"

import { useEffect, useState } from "react"
import { createClient } from "@supabase/supabase-js"

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
      if (data.user) fetchCredits()
    })
  }, [])

  async function fetchCredits() {
    const { data } = await supabase
      .from("user_credits")
      .select("credits")
      .single()

    if (data) setCredits(data.credits)
  }

  async function signIn() {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: window.location.origin,
      },
    })
  }

  async function signOut() {
    await supabase.auth.signOut()
    location.reload()
  }

  async function subscribe(plan: "pro" | "elite") {
    const res = await fetch("/api/stripe/subscribe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ plan }),
    })

    const data = await res.json()

    if (data.url) {
      window.location.href = data.url
    } else {
      alert("Failed to start checkout")
    }
  }

  return (
    <main className="min-h-screen bg-black text-teal-300 p-4">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <div className="text-lg font-bold">Aiexor</div>

        {!user ? (
          <button
            onClick={signIn}
            className="border border-teal-500 px-4 py-1 rounded"
          >
            Sign In
          </button>
        ) : (
          <div className="flex gap-2 items-center">
            <span>Credits: {credits ?? "…"}</span>
            <button
              onClick={signOut}
              className="border border-teal-500 px-3 py-1 rounded"
            >
              Sign Out
            </button>
          </div>
        )}
      </div>

      {/* BODY */}
      <h1 className="text-xl mb-4">Create your first image</h1>

      {!user ? (
        <p className="text-sm text-gray-400">
          Please sign in to generate images or buy credits.
        </p>
      ) : (
        <>
          <h2 className="mt-6 mb-2 font-semibold">Choose a subscription</h2>

          <div className="flex flex-col gap-2 max-w-sm">
            <button
              onClick={() => subscribe("pro")}
              className="border border-teal-500 p-2 rounded"
            >
              Pro — $29.99 / month (200 credits)
            </button>

            <button
              onClick={() => subscribe("elite")}
              className="border border-teal-500 p-2 rounded"
            >
              Elite — $49.99 / month (500 credits)
            </button>
          </div>
        </>
      )}
    </main>
  )
}
