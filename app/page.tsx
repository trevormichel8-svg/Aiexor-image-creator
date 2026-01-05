"use client"

import { useEffect, useState } from "react"
import { useCredits } from "@/context/CreditsContext"

export default function Page() {
  const { credits, refreshCredits } = useCredits()
  const [prompt, setPrompt] = useState("")
  const [loading, setLoading] = useState(false)

  // ✅ Stripe success handler
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    if (params.get("success")) {
      refreshCredits()
      window.history.replaceState({}, "", "/")
    }
  }, [refreshCredits])

  async function generateImage() {
    setLoading(true)
    await fetch("/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt }),
    })
    setLoading(false)
  }

  return (
    <>
      {/* Header */}
      <header className="flex justify-between items-center px-6 py-4 border-b border-zinc-800">
        <div className="font-semibold">Create Your First Image</div>
        <div className="text-sm text-zinc-400">
          Credits: <span className="text-teal-400">{credits}</span>
        </div>
      </header>

      {/* Canvas */}
      <main className="flex-1"></main>

      {/* Bottom Prompt Bar */}
      <div className="fixed bottom-0 left-14 right-0 p-4 bg-zinc-950 border-t border-zinc-800">
        <div className="flex gap-2 max-w-3xl mx-auto">
          <input
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe your image..."
            className="flex-1 rounded-full px-4 py-3 bg-zinc-900 border border-zinc-700 outline-none"
          />
          <button
            onClick={generateImage}
            disabled={loading || !prompt}
            className="px-6 rounded-full bg-teal-600 hover:bg-teal-500 disabled:opacity-50"
          >
            {loading ? "..." : "Generate"}
          </button>
        </div>
      </div>
    </>
  )
}
