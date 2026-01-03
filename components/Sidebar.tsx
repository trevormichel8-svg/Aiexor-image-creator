"use client"

import { useMemo, useState } from "react"
import artStyles from "@/lib/artStyles"

interface SidebarProps {
  open: boolean
  onClose: () => void
  artStyle: string
  setArtStyle: (v: string) => void
  strength: number
  setStrength: (v: number) => void
  credits: number
}

export default function Sidebar({
  open,
  onClose,
  artStyle,
  setArtStyle,
  strength,
  setStrength,
  credits,
}: SidebarProps) {
  const [query, setQuery] = useState("")

  const styles = useMemo(() => {
    if (!query) return artStyles
    return artStyles.filter((s) =>
      s.toLowerCase().includes(query.toLowerCase())
    )
  }, [query])

  return (
    <>
      {open && (
        <div
          onClick={onClose}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.6)",
          }}
        />
      )}

      <aside
        style={{
          position: "fixed",
          top: 0,
          left: open ? 0 : -340,
          width: 320,
          height: "100%",
          background: "var(--bg-panel)",
          padding: 24,
          transition: "left 0.25s ease",
          overflowY: "auto",
        }}
      >
        <h2 style={{ marginBottom: 8 }}>Art Settings</h2>

        <div
          style={{
            background: "rgba(20,184,166,0.12)",
            color: "var(--accent)",
            padding: "6px 12px",
            borderRadius: 999,
            fontSize: 14,
            width: "fit-content",
            marginBottom: 24,
          }}
        >
          Credits: {credits}
        </div>

        <label style={{ fontSize: 13, color: "var(--text-muted)" }}>
          Search styles
        </label>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="e.g. cinematic, anime…"
          style={{ marginBottom: 16 }}
        />

        <select
          size={10}
          value={artStyle}
          onChange={(e) => setArtStyle(e.target.value)}
          style={{ width: "100%", marginBottom: 24 }}
        >
          {styles.map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>

        <label style={{ fontSize: 13, color: "var(--text-muted)" }}>
          Strength: {strength}
        </label>
        <input
          type="range"
          min={0}
          max={100}
          value={strength}
          onChange={(e) => setStrength(Number(e.target.value))}
        />
      </aside>
    </>
  )
}
