"use client"

import { useState } from "react"
import Sidebar from "@/components/Sidebar"
import PromptBar from "@/components/PromptBar"
import ImageCanvas from "@/components/ImageCanvas"
import ImageLightbox from "@/components/ImageLightbox"
import BuyCreditsModal from "@/components/BuyCreditsModal"
import AuthButton from "@/components/AuthButton"
import artStyles from "@/lib/artStyles"

export default function Page() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [imageSrc, setImageSrc] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [buyOpen, setBuyOpen] = useState(false)

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

      if (!res.ok) {
        alert(data.error ?? "Generation failed")
        return
      }

      setImageSrc(data.imageUrl)
      setLightboxOpen(false)
    } catch (err) {
      console.error(err)
      alert("Unexpected error")
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="canvas bg-[#0b1416] text-white min-h-screen">
      {/* Auth button */}
      <div style={{ position: "fixed", top: 16, right: 16, zIndex: 60 }}>
        <AuthButton />
      </div>

      {/* Buy credits button */}
      <button
        onClick={() => setBuyOpen(true)}
        className="fixed bottom-6 right-6 z-40
                   px-4 py-2 rounded-full
                   bg-teal-600 text-black font-medium
                   shadow-[0_0_18px_rgba(45,212,191,0.6)]
                   hover:bg-teal-500 transition"
      >
        Buy Credits
      </button>

      {/* Sidebar toggle */}
      {!sidebarOpen && (
        <button
          className="sidebar-button fixed top-6 left-6
                     text-teal-400 text-xl
                     shadow-[0_0_12px_rgba(45,212,191,0.5)]"
          onClick={() => setSidebarOpen(true)}
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
      />

      {/* Image output */}
      <div className="flex justify-center items-center mt-20 px-4">
        {imageSrc ? (
          <div
            className="image-wrapper cursor-zoom-in"
            onClick={() => setLightboxOpen(true)}
          >
            <ImageCanvas src={imageSrc} />
          </div>
        ) : (
          <div className="empty-state text-center opacity-70">
            <h2 className="text-xl">Create Your First Image</h2>
          </div>
        )}
      </div>

      {/* Loading */}
      {loading && (
        <div className="p-6 text-center text-teal-400">
          Generating image…
        </div>
      )}

      {/* Prompt bar */}
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

      {/* Buy credits modal */}
      <BuyCreditsModal
        open={buyOpen}
        onClose={() => setBuyOpen(false)}
      />
    </main>
  )
}
