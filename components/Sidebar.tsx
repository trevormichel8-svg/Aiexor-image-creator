"use client"

import { useMemo, useState, useRef } from "react"
import artStyles from "@/lib/artStyles"

interface SidebarProps {
  open: boolean
  onClose: () => void
  artStyle: string
  setArtStyle: (value: string) => void
  strength: number
  setStrength: (value: number) => void
}

// Use the shared art styles list exported from the library. Defining the list
// in a single location avoids accidental divergence between different UI
// components. If more styles are added they will automatically be available
// here without further changes.
const ART_STYLES = artStyles

export default function Sidebar({
  open,
  onClose,
  artStyle,
  setArtStyle,
  strength,
  setStrength,
}: SidebarProps) {

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
