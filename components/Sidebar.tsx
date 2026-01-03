"use client"

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
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <h2>Art Settings</h2>

          <button
            onClick={onClose}
            style={{
              background: "transparent",
              border: "none",
              color: "var(--accent)",
              fontSize: 22,
              cursor: "pointer",
              textShadow: "0 0 10px var(--accent)",
            }}
          >
            ×
          </button>
        </div>

        {/* Credits */}
        <div
          style={{
            marginTop: 12,
            marginBottom: 24,
            background: "rgba(20,184,166,0.15)",
            color: "var(--accent)",
            padding: "8px 14px",
            borderRadius: 999,
            width: "fit-content",
            boxShadow: "0 0 12px rgba(20,184,166,0.4)",
          }}
        >
          Credits: {credits}
        </div>

        {/* Art Styles Pill Dropdown */}
        <label style={{ fontSize: 13, color: "var(--text-muted)" }}>
          Art Styles
        </label>

        <select
          value={artStyle}
          onChange={(e) => setArtStyle(e.target.value)}
          style={{
            width: "100%",
            marginTop: 8,
            marginBottom: 28,
            borderRadius: 999,
            padding: "12px 16px",
            background: "var(--accent)",
            color: "#022c28",
            fontWeight: 600,
            border: "none",
            boxShadow: "0 0 14px rgba(20,184,166,0.6)",
            cursor: "pointer",
          }}
        >
          {artStyles.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>

        {/* Strength Slider */}
        <label style={{ fontSize: 13, color: "var(--text-muted)" }}>
          Strength: {strength}
        </label>

        <input
          type="range"
          min={0}
          max={100}
          value={strength}
          onChange={(e) => setStrength(Number(e.target.value))}
          style={{
            width: "100%",
            marginTop: 8,
            appearance: "none",
            height: 6,
            borderRadius: 999,
            background: "linear-gradient(to right, var(--accent), var(--accent))",
            boxShadow: "0 0 10px rgba(20,184,166,0.6)",
          }}
        />

        <style jsx>{`
          input[type="range"]::-webkit-slider-thumb {
            appearance: none;
            width: 18px;
            height: 18px;
            border-radius: 50%;
            background: var(--accent);
            box-shadow: 0 0 12px rgba(20,184,166,0.9);
            cursor: pointer;
          }
        `}</style>
      </aside>
    </>
  )
}
