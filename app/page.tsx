"use client"

import { useEffect, useState, useRef } from "react"

type ImageItem = {
  id: string
  url: string
  prompt: string
  watermarked: boolean
}

const STYLES = [
  "Photorealistic",
  "Cinematic",
  "Anime",
  "Cyberpunk",
  "Watercolor",
  "Oil Painting",
  "Pencil Sketch",
  "Charcoal",
  "3D Render",
  "Low Poly",
  "Pixel Art",
  "Fantasy",
  "Sci-Fi",
  "Dark Gothic",
  "Minimalist",
  "Isometric",
  "Concept Art",
  "Ukiyo-e",
  "Vaporwave",
  "Neon Noir",
  // you can add 100+ here safely
]

export default function Page() {
  const [prompt, setPrompt] = useState("")
  const [style, setStyle] = useState(STYLES[0])
  const [images, setImages] = useState<ImageItem[]>([])
  const [loading, setLoading] = useState(false)
  const [creditsLeft, setCreditsLeft] = useState(5)
  const [showUpgrade, setShowUpgrade] = useState(false)

  async function generate(remixPrompt?: string) {
    if (creditsLeft <= 0) {
      setShowUpgrade(true)
      return
    }

    setLoading(true)

    const res = await fetch("/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        prompt: remixPrompt ?? prompt,
        style,
      }),
    })

    const data = await res.json()

    if (data.error) {
      alert(data.error)
      setLoading(false)
      return
    }

    setImages(prev => [
      {
        id: crypto.randomUUID(),
        url: data.image,
        prompt: data.prompt,
        watermarked: data.watermarked,
      },
      ...prev,
    ])

    setCreditsLeft(data.creditsLeft)
    setLoading(false)
  }

  return (
    <main className="min-h-screen bg-[#0b0b0b] text-white flex flex-col">

      {/* HEADER */}
      <header className="p-4 border-b border-teal-500/30 flex justify-between">
        <div className="font-bold text-teal-400">Aiexor</div>
        <div className="text-sm">
          Credits: <span className="text-teal-400">{creditsLeft}</span>
        </div>
      </header>

      {/* GALLERY */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {images.map(img => (
          <div key={img.id} className="border border-teal-500/20 rounded p-2">
            <img src={img.url} className="rounded mb-2" />
            {img.watermarked && (
              <div className="text-xs text-red-400">Watermarked (Free)</div>
            )}
            <div className="text-xs opacity-70 mb-2">{img.prompt}</div>
            <button
              onClick={() => generate(img.prompt)}
              className="text-xs border border-teal-400 px-2 py-1 rounded hover:bg-teal-400/10"
            >
              Remix
            </button>
          </div>
        ))}
      </div>

      {/* PROMPT BAR */}
      <div className="p-3 border-t border-teal-500/30 bg-[#0b0b0b]">
        <div className="flex gap-2 mb-2">
          <select
            value={style}
            onChange={e => setStyle(e.target.value)}
            className="bg-black border border-teal-500/40 text-xs p-2 rounded flex-1"
          >
            {STYLES.map(s => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </div>

        <div className="flex gap-2">
          <input
            value={prompt}
            onChange={e => setPrompt(e.target.value)}
            placeholder="Describe the image you want…"
            className="flex-1 bg-black border border-teal-500/60 p-3 rounded outline-none focus:ring-2 focus:ring-teal-400"
          />
          <button
            onClick={() => generate()}
            disabled={loading}
            className="px-4 rounded bg-teal-500 text-black font-semibold shadow-[0_0_10px_#14b8a6]"
          >
            {loading ? "…" : "Generate"}
          </button>
        </div>
      </div>

      {/* UPGRADE MODAL */}
      {showUpgrade && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center">
          <div className="bg-[#111] p-6 rounded border border-teal-500/40 w-80">
            <h2 className="text-teal-400 font-bold mb-2">Out of credits</h2>
            <p className="text-sm mb-4">
              Upgrade to Pro or Elite for unlimited generations.
            </p>
            <button
              onClick={() => setShowUpgrade(false)}
              className="w-full border border-teal-400 py-2 rounded"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </main>
  )
}
