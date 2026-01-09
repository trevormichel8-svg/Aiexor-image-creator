"use client"

import { useEffect, useState } from "react"
import { createClient } from "@supabase/supabase-js"
import { Gallery } from "@/components/Gallery"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function Page() {
  const [user, setUser] = useState<any>(null)
  const [credits, setCredits] = useState<number>(0)
  const [prompt, setPrompt] = useState("")
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [showUpgrade, setShowUpgrade] = useState(false)

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data }) => {
      if (!data.user) return
      setUser(data.user)

      const { data: creditRow } = await supabase
        .from("user_credits")
        .select("credits")
        .eq("user_id", data.user.id)
        .single()

      setCredits(creditRow?.credits ?? 0)
    })

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

  async function generateImage() {
    if (!prompt.trim()) return
    if (credits <= 0) {
      setShowUpgrade(true)
      return
    }

    setLoading(true)
    setImageUrl(null)

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      })

      const data = await res.json()

      if (data.image) {
        setImageUrl(data.image)
        setCredits((c) => c - 1)
      } else {
        alert("Generation failed")
      }
    } catch {
      alert("Error generating image")
    } finally {
      setLoading(false)
    }
  }

  const LOW_CREDIT = credits > 0 && credits <= 10
  const OUT_OF_CREDITS = credits <= 0

  return (
    <main className="min-h-screen bg-black text-white p-4">
      {/* HEADER */}
      <header className="flex justify-between items-center mb-4">
        <div>
          <div className="text-lg font-bold">Aiexor</div>
          {user && (
            <div className="text-xs text-gray-400">
              {credits} credits · 1 credit / image
            </div>
          )}
        </div>

        {!user ? (
          <button onClick={signIn} className="border px-3 py-1 rounded">
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
        <div className="mb-3 p-3 rounded bg-yellow-900 text-yellow-200 text-sm">
          ⚠️ Low credits remaining
        </div>
      )}

      {OUT_OF_CREDITS && user && (
        <div className="mb-3 p-3 rounded bg-red-900 text-red-200 text-sm">
          ❌ Out of credits — upgrade to continue
        </div>
      )}

      {/* PROMPT */}
      {user && (
        <>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe the image you want..."
            className="w-full p-3 rounded bg-zinc-900 border border-zinc-700 mb-3 text-sm"
            rows={3}
          />

          <button
            onClick={generateImage}
            disabled={loading}
            className="w-full border py-2 rounded mb-4"
          >
            {loading ? "Generating…" : "Generate Image"}
          </button>
        </>
      )}

      {/* IMAGE RESULT */}
      {imageUrl && (
        <div className="mt-4">
          <img
            src={imageUrl}
            alt="Generated"
            className="rounded w-full"
          />
        </div>
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
    </main>
  )
}
