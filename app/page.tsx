"use client"

import { useEffect, useState } from "react"
import { useCredits } from "@/context/CreditsContext"

export default function Page() {
  const { credits, refreshCredits } = useCredits()
  const [prompt, setPrompt] = useState("")
  const [loading, setLoading] = useState(false)
  const [imageUrl, setImageUrl] = useState<string | null>(null)

  // ✅ Run ONCE after Stripe redirect
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)

    if (params.get("success")) {
      refreshCredits()

      // clean URL so it doesn’t re-run on refresh
      window.history.replaceState({}, "", "/")
    }
  }, [refreshCredits])

  async function generateImage() {
    setLoading(true)

    const res = await fetch("/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt }),
    })

    const data = await res.json()

    if (data.image) {
      setImageUrl(data.image)
    }

    setLoading(false)
  }

  return (
    <main className="min-h-screen bg-black text-white flex flex-col items-center p-6">
      <h1 className="text-2xl font-bold mb-4">Create Your First Image</h1>

      <div className="mb-4 text-sm text-gray-300">
        Credits: <span className="font-semibold">{credits}</span>
      </div>

      <input
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Describe your image..."
        className="w-full max-w-xl p-3 rounded bg-zinc-900 border border-zinc-700 mb-4"
      />

      <button
        onClick={generateImage}
        disabled={loading || !prompt}
        className="px-6 py-2 rounded bg-teal-600 hover:bg-teal-500 disabled:opacity-50"
      >
        {loading ? "Generating..." : "Generate"}
      </button>

      {imageUrl && (
        <img
          src={imageUrl}
          alt="Generated"
          className="mt-6 rounded max-w-full"
        />
      )}
    </main>
  )
}
