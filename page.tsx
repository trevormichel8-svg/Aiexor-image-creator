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

  // Maintain the prompt, art style and strength locally in this component. We
  // pass these down to Sidebar and PromptBar so that changes in one place
  // propagate to the others. The default art style comes from the shared
  // art styles list to ensure it is always a valid option.
  const [prompt, setPrompt] = useState("")
  const [artStyle, setArtStyle] = useState<string>(artStyles[0] ?? "")
  const [strength, setStrength] = useState<number>(70)

  async function handleGenerate() {
    // Don't attempt to generate if the prompt is empty or we're already
    // generating an image. Trim whitespace to avoid sending blank prompts.
    if (!prompt.trim() || loading) return
    setLoading(true)
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: prompt.trim(), style: artStyle, strength }),
      })
      if (!res.ok) {
        console.error("Failed to generate image", await res.text())
        return
      }
      const data: { imageUrl: string } = await res.json()
      setImageSrc(data.imageUrl)
      setLightboxOpen(false)
    } catch (error) {
      console.error(error)
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
      />

      {/* If an image has been generated, display it. Otherwise show an empty state. */}
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

      {/* Show a transient loading indicator when awaiting the API response */}
      {loading && <div className="p-6 text-center">Generating image…</div>}

      <PromptBar
        onGenerate={handleGenerate}
        prompt={prompt}
        setPrompt={setPrompt}
      />

      {/* Display the full-screen lightbox when the user clicks on the image */}
      {lightboxOpen && imageSrc && (
        <ImageLightbox src={imageSrc} onClose={() => setLightboxOpen(false)} />
      )}
    </main>
  )
}
