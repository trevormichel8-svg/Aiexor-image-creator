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
    if (!query) return artStyles
    return artStyles.filter((style) =>
      style.toLowerCase().includes(query.toLowerCase())
    )
  }, [query])

  function onTouchStart(e: React.TouchEvent) {
    startX.current = e.touches[0].clientX
  }

  function onTouchEnd(e: React.TouchEvent) {
    if (startX.current === null) return
    if (e.changedTouches[0].clientX - startX.current > 80) {
      onClose()
    }
    startX.current = null
  }

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black/60 z-40 transition ${
          open ? "block" : "hidden"
        }`}
        onClick={onClose}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      />

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-72 z-50
                    bg-[#0b1416] border-r border-teal-500/30
                    shadow-[0_0_30px_rgba(45,212,191,0.25)]
                    transform transition-transform
                    ${open ? "translate-x-0" : "-translate-x-full"}`}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-teal-400 text-xl
                     shadow-[0_0_12px_rgba(45,212,191,0.5)]"
        >
          ×
        </button>

        <div className="p-5 space-y-6">
          <h2 className="text-lg font-semibold text-teal-400">
            Art Settings
          </h2>

          {/* Art style dropdown */}
          <label className="text-sm text-teal-300">Art Style</label>
          <select
            value={artStyle}
            onChange={(e) => setArtStyle(e.target.value)}
            className="w-full bg-[#081214] border border-teal-500/40
                       rounded-lg p-2 text-teal-200
                       shadow-[0_0_10px_rgba(45,212,191,0.3)]"
          >
            {filteredStyles.map((style) => (
              <option key={style} value={style}>
                {style}
              </option>
            ))}
          </select>

          {/* Strength slider */}
          <div>
            <div className="flex justify-between text-sm text-teal-300 mb-1">
              <span>Strength</span>
              <span>{strength}</span>
            </div>

            <input
              type="range"
              min={0}
              max={100}
              value={strength}
              onChange={(e) => setStrength(Number(e.target.value))}
              className="w-full accent-teal-400"
            />
          </div>
        </div>
      </aside>
    </>
  )
}
