"use client"

import { useState } from "react"
import Sidebar from "@/components/Sidebar"
import PromptBar from "@/components/PromptBar"
import ImageCanvas from "@/components/ImageCanvas"
import ImageLightbox from "@/components/ImageLightbox"
import BuySubscriptionModal from "@/components/BuySubscriptionModal"
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
    <main className="bg-[#0b1416] text-white min-h-screen relative">
      {/* Auth */}
      <div className="fixed top-4 right-4 z-50">
        <AuthButton />
      </div>

      {/* Subscribe button */}
      <button
        onClick={() => setBuyOpen(true)}
        className="fixed bottom-6 right-6 z-40
                   px-5 py-3 rounded-full
                   bg-teal-500 text-black font-semibold
                   shadow-[0_0_20px_rgba(45,212,191,0.6)]
                   hover:bg-teal-400 transition"
      >
        Subscribe
      </button>

      {/* Sidebar toggle */}
      {!sidebarOpen && (
        <button
          onClick={() => setSidebarOpen(true)}
          className="fixed top-6 left-6 z-40
                     text-teal-400 text-2xl
                     shadow-[0_0_12px_rgba(45,212,191,0.6)]"
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
      <div className="flex justify-center items-center mt-24 px-4">
        {imageSrc ? (
          <div
            className="cursor-zoom-in"
            onClick={() => setLightboxOpen(true)}
          >
            <ImageCanvas src={imageSrc} />
          </div>
        ) : (
          <div className="text-center opacity-70">
            <h2 className="text-xl">Create your first image</h2>
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

      {/* Subscription modal */}
      <BuySubscriptionModal
        open={buyOpen}
        onClose={() => setBuyOpen(false)}
      />
    </main>
  )
}
