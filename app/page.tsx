"use client"

import { useEffect, useState } from "react"
import { createClient } from "@supabase/supabase-js"
import Gallery from "./components/Gallery"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function Page() {
  const [user, setUser] = useState<any>(null)
  const [credits, setCredits] = useState<number>(0)
  const [prompt, setPrompt] = useState("")

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) {
        setUser(data.user)
        fetchCredits()
      }
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

  const isFree = !user || credits <= 0
  const lowCredits = credits > 0 && credits <= 5

  return (
    <main className="min-h-screen bg-black text-white p-4">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-4">
        <div className="font-bold text-lg">Aiexor</div>

        {!user ? (
          <button onClick={signIn} className="border px-3 py-1 rounded">
            Sign In
          </button>
        ) : (
          <div className="flex gap-2 items-center text-sm">
            <span>
              {isFree ? "FREE" : `${credits} credits`}
            </span>
            <button onClick={signOut} className="border px-2 py-1 rounded">
              Sign Out
            </button>
          </div>
        )}
      </div>

      {/* WARNINGS */}
      {lowCredits && (
        <div className="bg-yellow-600 text-black p-2 rounded mb-3 text-sm">
          ⚠️ Low credits — upgrade soon
        </div>
      )}

      {isFree && user && (
        <div className="bg-red-600 p-3 rounded mb-4 text-sm">
          🚫 Free tier — watermarked images & no downloads
        </div>
      )}

      {/* PROMPT */}
      <textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Describe the image you want to generate…"
        className="w-full bg-zinc-900 p-3 rounded mb-4"
      />

      {/* GENERATE (UI ONLY FOR NOW) */}
      <button
        className="w-full bg-white text-black py-2 rounded mb-6 opacity-60"
        disabled
      >
        Generate Image (coming next)
      </button>

      {/* GALLERY */}
      <Gallery isFree={isFree} />
    </main>
  )
}
