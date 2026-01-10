"use client"

import { useState } from "react"

export default function ImageGenerator({
  disabled,
  onOutOfCredits,
}: {
  disabled?: boolean
  onOutOfCredits?: () => void
}) {
  const [prompt, setPrompt] = useState("")
  const [loading, setLoading] = useState(false)
  const [image, setImage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function generate() {
    if (!prompt.trim()) return

    setLoading(true)
    setError(null)
    setImage(null)

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      })

      if (res.status === 402) {
        onOutOfCredits?.()
        setError("Out of credits")
        return
      }

      const data = await res.json()

      if (!data.image) {
        throw new Error("No image returned")
      }

      setImage(data.image)
    } catch (err) {
      setError("Failed to generate image")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md mx-auto mt-6">
      {/* PROMPT */}
      <textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Describe the image you want to create…"
        className="w-full p-3 rounded bg-zinc-900 border border-zinc-700 text-white text-sm resize-none"
        rows={4}
        disabled={disabled || loading}
      />

      {/* GENERATE BUTTON */}
      <button
        onClick={generate}
        disabled={disabled || loading}
        className={`mt-3 w-full p-2 rounded text-sm font-semibold
          ${
            disabled
              ? "bg-zinc-700 text-gray-400"
              : "bg-teal-600 hover:bg-teal-500"
          }`}
      >
        {loading ? "Generating…" : "Generate Image"}
      </button>

      {/* ERROR */}
      {error && (
        <div className="mt-3 text-red-400 text-sm text-center">
          {error}
        </div>
      )}

      {/* IMAGE RESULT */}
      {image && (
        <div className="mt-6">
          <img
            src={image}
            alt="Generated"
            className="w-full rounded-lg border border-zinc-700"
          />

          <div className="mt-2 text-xs text-gray-400 text-center">
            Long-press to save image
          </div>
        </div>
      )}
    </div>
  )
}
