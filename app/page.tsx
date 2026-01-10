"use client"

import { useEffect, useState } from "react"
import { createClient } from "@supabase/supabase-js"
import ImageGenerator from "./components/ImageGenerator"
import Gallery from "./components/Gallery"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function Page() {
  const [user, setUser] = useState<any>(null)
  const [credits, setCredits] = useState<number>(0)
  const [plan, setPlan] = useState<string>("free")
  const [showUpgrade, setShowUpgrade] = useState(false)

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) {
        setUser(data.user)
        loadCredits(data.user.id)
      }
    })
  }, [])

  async function loadCredits(userId: string) {
    const { data } = await supabase
      .from("user_credits")
      .select("credits, plan")
      .eq("user_id", userId)
      .single()

    setCredits(data?.credits ?? 0)
    setPlan(data?.plan ?? "free")
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
    const res = await fetch("/api/stripe/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ plan, userId: user.id }),
    })

    const data = await res.json()
    if (data.url) window.location.href = data.url
  }

  function UpgradeModal() {
    if (!showUpgrade) return null

    return (
      <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
        <div className="bg-zinc-900 p-6 rounded-lg w-[90%] max-w-sm text-center">
          <h2 className="text-lg font-bold mb-2">Upgrade Required</h2>
          <p className="text-sm text-gray-400 mb-4">
            Remove watermarks and unlock full-quality images.
          </p>

          <button
            onClick={() => subscribe("pro")}
            className="w-full border border-teal-500 p-2 rounded mb-2"
          >
            Pro — $29.99 / month
          </button>

          <button
            onClick={() => subscribe("elite")}
            className="w-full border border-teal-500 p-2 rounded"
          >
            Elite — $49.99 / month
          </button>

          <button
            onClick={() => setShowUpgrade(false)}
            className="mt-4 text-sm text-gray-400"
          >
            Cancel
          </button>
        </div>
      </div>
    )
  }

  const outOfCredits = plan !== "free" && credits <= 0

  return (
    <main className="min-h-screen bg-black text-white p-4">
      <UpgradeModal />

      <div className="flex justify-between items-center mb-4">
        <div className="font-bold text-lg">Aiexor</div>

        {!user ? (
          <button onClick={signIn} className="border px-3 py-1 rounded">
            Sign In
          </button>
        ) : (
          <button onClick={signOut} className="border px-3 py-1 rounded">
            Sign Out
          </button>
        )}
      </div>

      {user && (
        <div className="mb-4 text-sm text-gray-300">
          <strong>{plan.toUpperCase()}</strong> • {credits} credits
        </div>
      )}

      {!user ? (
        <p className="text-gray-400 text-sm">
          Sign in to generate images.
        </p>
      ) : (
        <>
          {plan === "free" && (
            <div className="mb-4 text-xs text-gray-400">
              Free tier • 5 images/day • Watermarked previews
            </div>
          )}

          <ImageGenerator
            disabled={outOfCredits}
            onOutOfCredits={() => setShowUpgrade(true)}
          />

          <Gallery userId={user.id} />

          <button
            onClick={() => setShowUpgrade(true)}
            className="mt-6 border border-teal-500 p-2 rounded w-full max-w-sm"
          >
            Buy / Upgrade
          </button>
        </>
      )}
    </main>
  )
}
