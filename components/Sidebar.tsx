"use client"

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
  if (!open) return null

  const teal = "#2dd4bf"

  return (
    <>
      {/* Overlay */}
      <div
        onClick={onClose}
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,0.7)",
          zIndex: 40,
        }}
      />

      {/* Sidebar */}
      <aside
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          height: "100%",
          width: 280,
          background: "#0b1416",
          borderRight: `1px solid ${teal}55`,
          boxShadow: `0 0 40px ${teal}55`,
          zIndex: 50,
          padding: 20,
        }}
      >
        {/* Close */}
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: 12,
            right: 12,
            width: 36,
            height: 36,
            borderRadius: "50%",
            background: "#00000088",
            color: teal,
            fontSize: 22,
            boxShadow: `0 0 12px ${teal}`,
          }}
        >
          ×
        </button>

        <h2
          style={{
            color: teal,
            fontSize: 18,
            fontWeight: 600,
            marginBottom: 24,
          }}
        >
          Art Settings
        </h2>

        {/* Art Style */}
        <label style={{ color: "#9fe5dd", fontSize: 14 }}>
          Art Style
        </label>

        <select
          value={artStyle}
          onChange={(e) => setArtStyle(e.target.value)}
          style={{
            width: "100%",
            marginTop: 8,
            marginBottom: 24,
            padding: "10px 14px",
            borderRadius: 999,
            background: "#081214",
            color: "#d1faf5",
            border: `1px solid ${teal}88`,
            boxShadow: `0 0 12px ${teal}55`,
            outline: "none",
          }}
        >
          {artStyles.map((style) => (
            <option key={style} value={style}>
              {style}
            </option>
          ))}
        </select>

        {/* Strength */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            color: "#9fe5dd",
            fontSize: 14,
            marginBottom: 6,
          }}
        >
          <span>Strength</span>
          <span>{strength}</span>
        </div>

        <input
          type="range"
          min={0}
          max={100}
          value={strength}
          onChange={(e) => setStrength(Number(e.target.value))}
          style={{
            width: "100%",
            accentColor: teal,
          }}
        />
      </aside>
    </>
  )
}
