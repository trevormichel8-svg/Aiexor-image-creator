"use client"

import { useEffect, useState } from "react"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

const LOW_CREDIT_THRESHOLD = 20

export default function Page() {
  const [user, setUser] = useState<any>(null)
  const [credits, setCredits] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user)
      if (data.user) fetchCredits()
      setLoading(false)
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
      options: { redirectTo: window.location.origin },
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
      body: JSON.stringify({
        plan,
        userId: user.id,
      }),
    })

    const data = await res.json()

    if (data.url) {
      window.location.href = data.url
    } else {
      alert("Failed to start checkout")
    }
  }

  // ---- UX STATE ----
  const isLowCredits =
    credits !== null && credits > 0 && credits <= LOW_CREDIT_THRESHOLD

  const isOutOfCredits = credits === 0

  // TEMP plan inference (safe for now)
  const plan =
    credits !== null && credits >= 800
      ? "Elite"
      : credits !== null && credits >= 300
      ? "Pro"
      : "Free"

  const hasSubscription = plan === "Elite" || plan === "Pro"

  return (
    <main className="min-h-screen bg-black text-teal-300 p-4">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-4">
        <div className="text-lg font-bold">Aiexor</div>

        {!user ? (
          <button
            onClick={signIn}
            className="border border-teal-500 px-4 py-1 rounded"
          >
            Sign In
          </button>
        ) : (
          <div className="flex flex-col items-end text-sm">
            <span>
              {plan} · {credits ?? "…"} credits
            </span>
            <button
              onClick={signOut}
              className="text-xs underline text-gray-400"
            >
              Sign Out
            </button>
          </div>
        )}
      </div>

      {/* LOW CREDIT WARNING */}
      {isLowCredits && (
        <div className="mb-4 rounded border border-yellow-500 bg-yellow-500/10 px-3 py-2 text-sm text-yellow-400">
          ⚠️ Low credits: {credits} left. Upgrade to avoid interruption.
        </div>
      )}

      {/* OUT OF CREDITS MODAL */}
      {isOutOfCredits && user && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
          <div className="w-full max-w-sm rounded-lg border border-teal-500 bg-black p-6 text-center">
            <h2 className="mb-3 text-lg font-semibold text-teal-300">
              You’re out of credits
            </h2>

            <p className="mb-4 text-sm text-gray-400">
              Elite gives you 800 credits per month.
            </p>

            <button
              onClick={() => subscribe("elite")}
              className="mb-2 w-full rounded bg-teal-500 py-2 font-semibold text-black"
            >
              Upgrade to Elite
            </button>

            <button
              onClick={() => location.reload()}
              className="w-full text-sm text-gray-400 underline"
            >
              Maybe later
            </button>
          </div>
        </div>
      )}

      {/* BODY */}
      <h1 className="text-xl mb-4">Create your first image</h1>

      {!user ? (
        <p className="text-sm text-gray-400">
          Please sign in to generate images or buy credits.
        </p>
      ) : (
        <>
          {/* SUBSCRIPTION ACTIONS */}
          {!hasSubscription ? (
            <>
              <h2 className="mt-6 mb-2 font-semibold">
                Choose a subscription
              </h2>

              <div className="flex flex-col gap-2 max-w-sm">
                <button
                  onClick={() => subscribe("pro")}
                  className="border border-teal-500 p-2 rounded"
                >
                  Pro — $29.99 / month (300 credits)
                </button>

                <button
                  onClick={() => subscribe("elite")}
                  className="border border-teal-500 p-2 rounded"
                >
                  Elite — $49.99 / month (800 credits)
                </button>
              </div>
            </>
          ) : (
            <div className="mt-6 max-w-sm rounded border border-teal-500/40 p-3 text-sm">
              <div className="mb-2">
                Current plan: <strong>{plan}</strong>
              </div>

              <button
                onClick={() =>
                  alert("Stripe portal coming next (safe to add)")
                }
                className="underline text-teal-400"
              >
                Manage subscription
              </button>
            </div>
          )}
        </>
      )}
    </main>
  )
}
