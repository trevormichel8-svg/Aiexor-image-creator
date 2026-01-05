"use client"

import { useEffect, useState } from "react"
import { createClient } from "@supabase/supabase-js"
import BuySubscription from "@/components/BuySubscription"
import { useCredits } from "@/context/CreditsContext"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function Page() {
  const { credits } = useCredits()

  const [user, setUser] = useState<any>(null)
  const [prompt, setPrompt] = useState("")
  const [loading, setLoading] = useState(false)
  const [imageUrl, setImageUrl] = useState<string | null>(null)

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user ?? null)
    })
  }, [])

  async function signIn() {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: window.location.origin }
    })
  }

  async function signOut() {
    await supabase.auth.signOut()
    window.location.reload()
  }

  async function generateImage() {
    if (!user) {
      alert("Please sign in first")
      return
    }

    if (!prompt.trim()) return

    setLoading(true)

    const res = await fetch("/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt })
    })

    const data = await res.json()

    if (data.imageUrl) setImageUrl(data.imageUrl)
    if (data.error) alert(data.error)

    setLoading(false)
  }

  return (
    <main className="min-h-screen bg-black text-white flex flex-col">
      {/* HEADER */}
      <header className="flex items-center justify-between px-4 py-3 border-b border-neutral-800">
        <div className="flex items-center gap-2">
          <button className="px-2 py-1 border border-neutral-700 rounded">☰</button>
          <span className="font-semibold">Aiexor</span>
        </div>

        <div className="flex items-center gap-4">
          {user && (
            <span className="text-sm text-teal-400">
              Credits: {credits ?? 0}
            </span>
          )}

          {!user ? (
            <button
              onClick={signIn}
              className="px-3 py-1 rounded bg-teal-500 text-black"
            >
              Sign in
            </button>
          ) : (
            <button
              onClick={signOut}
              className="px-3 py-1 rounded border border-neutral-700"
            >
              Sign out
            </button>
          )}
        </div>
      </header>

      {/* BODY */}
      <section className="flex-1 flex flex-col items-center px-4 py-8 gap-6">
        <h1 className="text-2xl font-semibold">Create Your First Image</h1>

        {/* BUY SUBSCRIPTION */}
        {user && (
          <div className="w-full max-w-sm bg-neutral-900 border border-neutral-800 rounded-lg p-4">
            <h2 className="text-lg mb-3">Choose a Plan</h2>
            <BuySubscription />
          </div>
        )}

        {/* IMAGE */}
        {imageUrl && (
          <img
            src={imageUrl}
            className="max-w-full rounded border border-neutral-800"
          />
        )}
      </section>

      {/* PROMPT BAR */}
      <footer className="p-4 border-t border-neutral-800 bg-black">
        <div className="max-w-2xl mx-auto flex gap-2">
          <input
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe your image..."
            className="flex-1 px-4 py-3 rounded bg-neutral-900 border border-neutral-700"
          />
          <button
            onClick={generateImage}
            disabled={loading}
            className="px-5 py-3 rounded bg-teal-500 text-black disabled:opacity-50"
          >
            {loading ? "…" : "Generate"}
          </button>
        </div>
      </footer>
    </main>
  )
}
