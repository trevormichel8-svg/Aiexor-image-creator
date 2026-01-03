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
      {/* Overlay */}
      {open && (
        <div
          onClick={onClose}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.65)",
            zIndex: 40,
          }}
        />
      )}

      {/* Sidebar */}
      <aside
        style={{
          position: "fixed",
          top: 0,
          left: open ? 0 : "-100%",
          width: "85vw",
          maxWidth: 340,
          height: "100%",
          background: "var(--bg-panel)",
          padding: 24,
          transition: "left 0.25s ease",
          zIndex: 50,
          overflowY: "auto",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 16,
          }}
        >
          <h2 style={{ margin: 0 }}>Art Settings</h2>

          {/* Close Button */}
          <button
            onClick={onClose}
            aria-label="Close sidebar"
            style={{
              background: "var(--accent)",
              color: "#022c28",
              borderRadius: "50%",
              width: 36,
              height: 36,
              border: "none",
              fontSize: 22,
              lineHeight: "36px",
              textAlign: "center",
              cursor: "pointer",
              boxShadow: "0 0 16px rgba(20,184,166,0.9)",
            }}
          >
            ×
          </button>
        </div>

        {/* Credits */}
        <div
          style={{
            background: "rgba(20,184,166,0.18)",
            color: "var(--accent)",
            padding: "8px 14px",
            borderRadius: 999,
            fontSize: 14,
            fontWeight: 600,
            width: "fit-content",
            marginBottom: 28,
            boxShadow: "0 0 14px rgba(20,184,166,0.5)",
          }}
        >
          Credits: {credits}
        </div>

        {/* Art Style Dropdown */}
        <label
          style={{
            fontSize: 13,
            color: "var(--text-muted)",
            marginBottom: 6,
            display: "block",
          }}
        >
          Art Styles
        </label>

        <select
          value={artStyle}
          onChange={(e) => setArtStyle(e.target.value)}
          style={{
            width: "100%",
            height: 48,
            marginBottom: 32,
            borderRadius: 999,
            padding: "0 16px",
            background: "var(--accent)",
            color: "#022c28",
            fontWeight: 700,
            border: "none",
            fontSize: 15,
            cursor: "pointer",
            boxShadow: "0 0 18px rgba(20,184,166,0.75)",
          }}
        >
          {artStyles.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>

        {/* Strength Slider */}
        <label
          style={{
            fontSize: 13,
            color: "var(--text-muted)",
            marginBottom: 6,
            display: "block",
          }}
        >
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
            height: 6,
            appearance: "none",
            borderRadius: 999,
            background: "rgba(20,184,166,0.4)",
            boxShadow: "0 0 12px rgba(20,184,166,0.6)",
          }}
        />

        {/* Slider Thumb */}
        <style jsx>{`
          input[type="range"]::-webkit-slider-thumb {
            appearance: none;
            width: 18px;
            height: 18px;
            border-radius: 50%;
            background: var(--accent);
            box-shadow: 0 0 16px rgba(20,184,166,0.9);
            cursor: pointer;
          }

          input[type="range"]::-moz-range-thumb {
            width: 18px;
            height: 18px;
            border-radius: 50%;
            background: var(--accent);
            box-shadow: 0 0 16px rgba(20,184,166,0.9);
            cursor: pointer;
            border: none;
          }
        `}</style>
      </aside>
    </>
  )
}
