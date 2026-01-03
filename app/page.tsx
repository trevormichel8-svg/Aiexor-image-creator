"use client"

import { useState } from "react"
import Sidebar from "@/components/Sidebar"
import PromptBar from "@/components/PromptBar"
import ImageCanvas from "@/components/ImageCanvas"
import ImageLightbox from "@/components/ImageLightbox"
import artStyles from "@/lib/artStyles"

export default function Page() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [imageSrc, setImageSrc] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [credits, setCredits] = useState(0)

  const [prompt, setPrompt] = useState("")
  const [artStyle, setArtStyle] = useState<string>(artStyles[0] ?? "")
  const [strength, setStrength] = useState<number>(70)

  async function handleGenerate() {
    if (!prompt.trim() || loading) return
    setLoading(true)

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: prompt.trim(),
          style: artStyle,
          strength,
        }),
      })

      const data = await res.json()

      if (typeof data.credits === "number") {
        setCredits(data.credits)
      }

      if (!res.ok) {
        console.error(data.error)
        return
      }

      setImageSrc(data.imageUrl)
      setLightboxOpen(false)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="canvas">
      {!sidebarOpen && (
        <button
  className="sidebar-button"
  onClick={() => setSidebarOpen(true)}
  style={{
    background: "var(--accent)",
    color: "#022c28",
    borderRadius: "50%",
    width: 44,
    height: 44,
    border: "none",
    boxShadow: "0 0 16px rgba(20,184,166,0.8)",
    cursor: "pointer",
    fontSize: 20,
  }}
>
  ☰
</button>
      )}

      <Sidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        artStyle={artStyle}
        setArtStyle={setArtStyle}
        strength={strength}
        setStrength={setStrength}
        credits={credits}
      />

      {imageSrc ? (
        <div
          className="image-wrapper"
          onClick={() => setLightboxOpen(true)}
          style={{ cursor: "zoom-in" }}
        >
          <ImageCanvas src={imageSrc} />
        </div>
      ) : (
        <div className="empty-state">
          <h2>Create Your First Image</h2>
        </div>
      )}

      {loading && <div className="p-6 text-center">Generating image…</div>}

      <PromptBar
        onGenerate={handleGenerate}
        prompt={prompt}
        setPrompt={setPrompt}
      />

      {lightboxOpen && imageSrc && (
        <ImageLightbox
          src={imageSrc}
          onClose={() => setLightboxOpen(false)}
        />
      )}
    </main>
  )
}
