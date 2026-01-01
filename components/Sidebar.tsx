"use client"

import { useImageSettings } from "@/lib/useImageSettings"
import { Slider } from "@/components/ui/Slider"

interface SidebarProps {
  open: boolean
  onClose: () => void
}

export default function Sidebar({ open, onClose }: SidebarProps) {
  const { artStyle, setArtStyle, strength, setStrength } = useImageSettings()

  if (!open) return null

  return (
    <>
      <div className="sidebar-overlay" onClick={onClose} />
      <aside className="sidebar">
        <button className="sidebar-close" onClick={onClose}>×</button>

        <h2 className="sidebar-title">Settings</h2>

        <div className="sidebar-content">
          <label>Art Style</label>

          <select
            value={artStyle}
            onChange={(e) => setArtStyle(e.target.value)}
          >
            <option>Realistic</option>
            <option>Anime</option>
            <option>Cyberpunk</option>
            <option>Fantasy</option>
          </select>

          <div className="slider-block">
            <div className="slider-label">Strength</div>
            <Slider value={strength} onChange={setStrength} />
          </div>
        </div>
      </aside>
    </>
  )
}
