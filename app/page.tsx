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
      {/* Mobile Sidebar Toggle */}
      {!sidebarOpen && (
        <button
          onClick={() => setSidebarOpen(true)}
          style={{
            position: "fixed",
            top: 14,
            left: 14,
            zIndex: 60,
            width: 44,
            height: 44,
            borderRadius: "50%",
            background: "var(--accent)",
            color: "#022c28",
            border: "none",
            fontSize: 20,
            cursor: "pointer",
            boxShadow: "0 0 16px rgba(20,184,166,0.9)",
          }}
        >
          ☰
        </button>
      )}

      {/* Sidebar */}
      <Sidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        artStyle={artStyle}
        setArtStyle={setArtStyle}
        strength={strength}
        setStrength={setStrength}
        credits={credits}
      />

      {/* Image Area */}
      {imageSrc ? (
        <div
          className="image-wrapper"
          onClick={() => setLightboxOpen(true)}
          style={{
            marginTop: 32,
            cursor: "zoom-in",
          }}
        >
          <ImageCanvas src={imageSrc} />
        </div>
      ) : (
        <div
          className="empty-state"
          style={{
            marginTop: 120,
            textAlign: "center",
            color: "var(--text-muted)",
          }}
        >
          <h2 style={{ marginBottom: 8 }}>Create your first image</h2>
          <p style={{ fontSize: 14 }}>
            Describe what you want to generate below
          </p>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div
          style={{
            marginTop: 24,
            textAlign: "center",
            color: "var(--accent)",
            textShadow: "0 0 10px rgba(20,184,166,0.6)",
          }}
        >
          Generating image…
        </div>
      )}

      {/* Prompt Bar */}
      <PromptBar
        onGenerate={handleGenerate}
        prompt={prompt}
        setPrompt={setPrompt}
      />

      {/* Lightbox */}
      {lightboxOpen && imageSrc && (
        <ImageLightbox
          src={imageSrc}
          onClose={() => setLightboxOpen(false)}
        />
      )}
    </main>
  )
}
