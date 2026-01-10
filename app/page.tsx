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

  return (
    <main className="min-h-screen bg-black text-white flex flex-col">
      {/* HEADER */}
      <header className="flex justify-between items-center px-4 py-3 border-b border-zinc-800">
        <div className="font-semibold text-lg tracking-wide">Aiexor</div>

        {!user ? (
          <button
            onClick={signIn}
            className="text-sm border border-zinc-700 px-3 py-1 rounded"
          >
            Sign in
          </button>
        ) : (
          <div className="flex items-center gap-3 text-sm text-zinc-400">
            <span>{isFree ? "Free" : `${credits} credits`}</span>
            <button
              onClick={signOut}
              className="border border-zinc-700 px-3 py-1 rounded text-white"
            >
              Sign out
            </button>
          </div>
        )}
      </header>

      {/* MAIN PROMPT AREA */}
      <section className="flex flex-col items-center px-4 py-10">
        <div className="w-full max-w-xl">
          <h1 className="text-xl font-medium mb-4 text-center">
            Describe the image you want to generate
          </h1>

          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="A cinematic portrait of a cyberpunk astronaut..."
            className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-4 resize-none focus:outline-none focus:border-teal-500"
            rows={4}
          />

          <button
            disabled
            className="w-full mt-4 bg-teal-500 text-black py-2 rounded-lg font-medium opacity-60 cursor-not-allowed"
          >
            Generate image
          </button>

          {isFree && user && (
            <p className="text-xs text-zinc-500 mt-3 text-center">
              Free images are watermarked · Upgrade to download
            </p>
          )}
        </div>
      </section>

      {/* GALLERY */}
      <section className="flex-1 px-4 pb-10">
        <Gallery isFree={isFree} />
      </section>
    </main>
  )
}
