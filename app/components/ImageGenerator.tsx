"use client"

import { useState } from "react"

const STYLES = [
  "Photorealistic",
  "Ultra Realistic",
  "Cinematic",
  "Studio Lighting",
  "HDR",
  "8K",
  "4K",
  "Sharp Focus",
  "Soft Focus",
  "Bokeh",
  "Macro Photography",
  "Wide Angle",
  "Portrait Photography",
  "Fashion Photography",
  "Product Photography",
  "Food Photography",
  "Landscape Photography",
  "Drone Shot",
  "Night Photography",
  "Golden Hour",
  "Low Light",
  "High Contrast",
  "Moody",
  "Dark Fantasy",
  "Epic Fantasy",
  "High Fantasy",
  "Sci-Fi",
  "Cyberpunk",
  "Steampunk",
  "Dieselpunk",
  "Biopunk",
  "Post-Apocalyptic",
  "Futuristic",
  "Retro Futurism",
  "Synthwave",
  "Vaporwave",
  "Anime",
  "Manga",
  "Chibi",
  "Studio Ghibli Style",
  "Pixar Style",
  "Disney Style",
  "Comic Book",
  "Graphic Novel",
  "Ink Illustration",
  "Line Art",
  "Minimalist",
  "Flat Design",
  "Vector Art",
  "Logo Design",
  "Icon Design",
  "Isometric",
  "Low Poly",
  "Voxel Art",
  "3D Render",
  "Octane Render",
  "Unreal Engine",
  "Blender Render",
  "Clay Render",
  "Digital Painting",
  "Oil Painting",
  "Watercolor",
  "Acrylic Painting",
  "Charcoal Drawing",
  "Pencil Sketch",
  "Pastel Drawing",
  "Ink Wash",
  "Concept Art",
  "Matte Painting",
  "Environment Art",
  "Character Design",
  "Creature Design",
  "Architectural Visualization",
  "Interior Design",
  "Exterior Design",
  "Fantasy Map",
  "Album Cover",
  "Poster Design",
  "T-Shirt Design",
  "Tattoo Design",
  "Sticker Design",
  "Pixel Art",
  "8-bit",
  "16-bit",
  "Retro Game Art",
  "Glitch Art",
  "Surreal",
  "Abstract",
  "Cubism",
  "Pop Art",
  "Impressionist",
  "Expressionist",
  "Neon",
  "Holographic",
  "Iridescent",
  "Luxury",
  "Minimal Black & White"
]

export default function ImageGenerator({
  disabled,
  onOutOfCredits,
}: {
  disabled?: boolean
  onOutOfCredits?: () => void
}) {
  const [prompt, setPrompt] = useState("")
  const [style, setStyle] = useState("Photorealistic")
  const [loading, setLoading] = useState(false)
  const [image, setImage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function generate() {
    if (!prompt.trim()) return

    setLoading(true)
    setError(null)
    setImage(null)

    try {
      const fullPrompt = `${prompt}, ${style} style`

      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: fullPrompt }),
      })

      if (res.status === 402 || res.status === 403) {
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

      {/* STYLE SELECTOR */}
      <select
        value={style}
        onChange={(e) => setStyle(e.target.value)}
        className="mt-3 w-full p-2 rounded bg-zinc-900 border border-zinc-700 text-sm"
        disabled={disabled || loading}
      >
        {STYLES.map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </select>

      {/* GENERATE BUTTON */}
      <button
        onClick={generate}
        disabled={disabled || loading}
        className={`mt-3 w-full p-2 rounded text-sm font-semibold ${
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

      {/* IMAGE */}
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
