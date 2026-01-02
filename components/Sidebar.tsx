"use client"

import { useImageSettings } from "@/lib/useImageSettings"
import { useMemo, useState, useRef } from "react"

interface SidebarProps {
  open: boolean
  onClose: () => void
}

const ART_STYLES = [
  // Realism / Photography
  "Photorealistic", "Ultra Realistic", "Cinematic", "Hyperrealism",
  "HDR Photography", "Studio Lighting", "Portrait Photography",
  "Macro Photography", "Long Exposure", "Film Grain", "35mm Film",
  "Analog Film", "Double Exposure",

  // Illustration
  "Digital Illustration", "Concept Art", "Character Design",
  "Environment Concept", "Matte Painting", "Ink Illustration",
  "Line Art", "Flat Illustration", "Coloring Book",

  // Anime / Manga
  "Anime", "Manga", "Chibi", "Studio Ghibli Style", "Cyberpunk Anime",
  "Mecha Anime", "Anime Portrait",

  // Painting
  "Oil Painting", "Watercolor", "Acrylic Painting", "Gouache",
  "Impasto", "Digital Painting",

  // Art Movements
  "Indigenous", "Impressionism", "Expressionism", "Surrealism", "Cubism",
  "Pop Art", "Minimalism", "Abstract Expressionism",

  // Sci-Fi / Fantasy
  "Cyberpunk", "Steampunk", "Solarpunk", "Dark Fantasy",
  "Epic Fantasy", "Sci-Fi Concept Art", "Alien World",

  // 3D / CGI
  "3D Render", "Blender Render", "Unreal Engine",
  "Low Poly", "Voxel Art",

  // Retro / Stylized
  "Pixel Art", "8-bit", "Vaporwave", "Synthwave",
  "Glitch Art", "Neon Noir", "Mosaic",

  // Design
  "Graphic Design", "Poster Design", "Album Cover",
  "Book Cover", "Vector Art",

  // Horror / Experimental
  "Horror", "Cosmic Horror", "Lovecraftian",
  "Generative Art", "Fractal Art", "Mixed Media",
]

export default function Sidebar({ open, onClose }: SidebarProps) {
  const { artStyle, setArtStyle, strength, setStrength } =
    useImageSettings()

  const [query, setQuery] = useState("")
  const startX = useRef<number | null>(null)

  const filteredStyles = useMemo(() => {
    if (!query) return ART_STYLES
    return ART_STYLES.filter((style) =>
      style.toLowerCase().includes(query.toLowerCase())
    )
  }, [query])

  function onTouchStart(e: React.TouchEvent) {
    startX.current = e.touches[0].clientX
  }

  function onTouchEnd(e: React.TouchEvent) {
    if (startX.current === null) return

    const endX = e.changedTouches[0].clientX
    const deltaX = endX - startX.current

    if (deltaX > 80) {
      onClose()
    }

    startX.current = null
  }

  return (
    <>
      <div
        className={`sidebar-overlay ${open ? "open" : ""}`}
        onClick={onClose}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      />

      <aside
        className={`sidebar ${open ? "open" : ""}`}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        <button className="sidebar-close" onClick={onClose}>
          ×
        </button>

        <h2 className="sidebar-title">Art Settings</h2>

        <div className="sidebar-content">
          <label>Search Art Styles</label>

          <input
            className="prompt-input"
            placeholder="Type to filter styles…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />

          <select
            size={8}
            value={artStyle}
            onChange={(e) => setArtStyle(e.target.value)}
          >
            {filteredStyles.map((style) => (
              <option key={style} value={style}>
                {style}
              </option>
            ))}
          </select>

          <div className="slider-block">
            <div className="slider-label">
              Strength: {strength}
            </div>

            <input
              type="range"
              min={0}
              max={100}
              value={strength}
              onChange={(e) =>
                setStrength(Number(e.target.value))
              }
            />
          </div>
        </div>
      </aside>
    </>
  )
}
