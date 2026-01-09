"use client"

import { useEffect, useState } from "react"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function Page() {
  const [user, setUser] = useState<any>(null)
  const [credits, setCredits] = useState<number>(0)
  const [loading, setLoading] = useState(true)
  const [showUpgrade, setShowUpgrade] = useState(false)

  // 🔁 Load user + credits
  useEffect(() => {
    supabase.auth.getUser().then(async ({ data }) => {
      if (!data.user) {
        setLoading(false)
        return
      }

      setUser(data.user)

      const { data: creditRow } = await supabase
        .from("user_credits")
        .select("credits")
        .eq("user_id", data.user.id)
        .single()

      setCredits(creditRow?.credits ?? 0)
      setLoading(false)
    })

    // 🔧 Remove hashtag from URL
    if (window.location.hash) {
      history.replaceState(null, "", window.location.pathname)
    }
  }, [])

  async function signIn() {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: window.location.origin },
    })
  }

  async function signOut() {
    await supabase.auth.signOut()
    location.reload()
  }

  async function subscribe(plan: "pro" | "elite") {
    const res = await fetch("/api/stripe/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ plan, userId: user.id }),
    })

    const data = await res.json()
    if (data.url) window.location.href = data.url
    else alert("Failed to start checkout")
  }

  const LOW_CREDIT = credits > 0 && credits <= 10
  const OUT_OF_CREDITS = credits <= 0

  return (
    <main className="min-h-screen bg-black text-white p-4">
      {/* HEADER */}
      <header className="flex justify-between items-center mb-6">
        <div>
          <div className="text-lg font-bold">Aiexor</div>
          {user && (
            <div className="text-xs text-gray-400">
              {credits > 0 ? `${credits} credits` : "FREE · 0 credits"} ·
              1 credit / image
            </div>
          )}
        </div>

        {!user ? (
          <button
            onClick={signIn}
            className="border px-3 py-1 rounded"
          >
            Sign In
          </button>
        ) : (
          <div className="flex gap-2">
            <button
              onClick={() => setShowUpgrade(true)}
              className="border px-3 py-1 rounded"
            >
              Buy
            </button>
            <button
              onClick={signOut}
              className="border px-3 py-1 rounded"
            >
              Sign Out
            </button>
          </div>
        )}
      </header>

      {/* WARNINGS */}
      {LOW_CREDIT && (
        <div className="mb-4 p-3 rounded bg-yellow-900 text-yellow-200 text-sm">
          ⚠️ Low credits remaining. Upgrade soon.
        </div>
      )}

      {OUT_OF_CREDITS && user && (
        <div className="mb-4 p-3 rounded bg-red-900 text-red-200 text-sm">
          ❌ You’re out of credits. Upgrade to continue.
        </div>
      )}

      {/* BODY */}
      <h1 className="text-xl mb-4">Create your first image</h1>

      {!user && (
        <p className="text-gray-400 text-sm">
          Sign in to generate images or buy credits.
        </p>
      )}

      {/* UPGRADE MODAL */}
      {showUpgrade && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="bg-zinc-900 p-5 rounded max-w-sm w-full">
            <h2 className="text-lg font-semibold mb-3">
              Choose a subscription
            </h2>

            <div className="flex flex-col gap-2">
              <button
                onClick={() => subscribe("pro")}
                className="border p-2 rounded"
              >
                Pro — $29.99 / month (400 credits)
              </button>

              <button
                onClick={() => subscribe("elite")}
                className="border p-2 rounded"
              >
                Elite — $49.99 / month (800 credits)
              </button>
            </div>

            <button
              onClick={() => setShowUpgrade(false)}
              className="mt-4 text-sm text-gray-400"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* PLACEHOLDER GENERATOR */}
      {user && !OUT_OF_CREDITS && (
        <div className="mt-6 text-gray-500 text-sm">
          (Image generator UI goes here)
        </div>
      )}
    </main>
  )
}
