"use client"

import { useImageSettings } from "@/lib/useImageSettings"
import { useMemo } from "react"

interface SidebarProps {
  open: boolean
  onClose: () => void
}

const ART_STYLES = [
  // Realism / Photography
  "Photorealistic",
  "Ultra Realistic",
  "Double Exposure",
  "Cinematic",
  "Hyperrealism",
  "HDR Photography",
  "Studio Lighting",
  "Portrait Photography",
  "Macro Photography",
  "Long Exposure",
  "Film Grain",
  "35mm Film",
  "DSLR Photo",
  "Analog Film",

  // Illustration
  "Digital Illustration",
  "Concept Art",
  "Character Design",
  "Environment Concept",
  "Matte Painting",
  "Children's Book Illustration",
  "Editorial Illustration",
  "Ink Illustration",
  "Line Art",
  "Flat Illustration",
  "Coloring Book",
  
  // Anime / Manga
  "Anime",
  "Manga",
  "Chibi",
  "Studio Ghibli Style",
  "Shonen Anime",
  "Shojo Anime",
  "Mecha Anime",
  "Cyberpunk Anime",
  "Anime Portrait",
  "Anime Background",

  // Painting
  "Oil Painting",
  "Watercolor",
  "Acrylic Painting",
  "Gouache",
  "Impasto",
  "Fresco",
  "Encaustic",
  "Digital Painting",
  "Plein Air Painting",

  // Art Movements
  "Impressionism",
  "Post-Impressionism",
  "Expressionism",
  "Abstract Expressionism",
  "Surrealism",
  "Cubism",
  "Fauvism",
  "Dadaism",
  "Pop Art",
  "Minimalism",
  "Brutalism",
  "Indigenous",
  "Constructivism",

  // Sci-Fi / Fantasy
  "Cyberpunk",
  "Steampunk",
  "Dieselpunk",
  "Biopunk",
  "Solarpunk",
  "High Fantasy",
  "Dark Fantasy",
  "Epic Fantasy",
  "Sci-Fi Concept Art",
  "Space Opera",
  "Alien World",
  "Futuristic City",

  // 3D / CGI
  "3D Render",
  "Octane Render",
  "Unreal Engine",
  "Blender Render",
  "Cinema 4D",
  "Isometric 3D",
  "Low Poly",
  "Voxel Art",

  // Retro / Stylized
  "Pixel Art",
  "8-bit",
  "16-bit",
  "Retro Arcade",
  "Vaporwave",
  "Synthwave",
  "Glitch Art",
  "Y2K",
  "Neon Noir",

  // Design / Graphic
  "Graphic Design",
  "Poster Design",
  "Album Cover",
  "Book Cover",
  "Logo Design",
  "Typography Art",
  "Vector Art",
  "Infographic",

  // Horror / Dark
  "Horror",
  "Cosmic Horror",
  "Gothic",
  "Dark Surrealism",
  "Lovecraftian",
  "Creepy Illustration",

  // Experimental
  "AI Abstract",
  "Procedural Art",
  "Generative Art",
  "Fractal Art",
  "Data-moshing",
  "Mixed Media",
]

export default function Sidebar({ open, onClose }: SidebarProps) {
  const {
    artStyle,
    setArtStyle,
    strength,
    setStrength,
  } = useImageSettings()

  const styles = useMemo(() => ART_STYLES, [])

  if (!open) return null

  return (
    <>
      <div className="sidebar-overlay" onClick={onClose} />

      <aside className="sidebar">
        <button className="sidebar-close" onClick={onClose}>
          ×
        </button>

        <h2 className="sidebar-title">Art Settings</h2>

        <div className="sidebar-content">
          <label>Art Style</label>

          <select
            value={artStyle}
            onChange={(e) => setArtStyle(e.target.value)}
          >
            {styles.map((style) => (
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
