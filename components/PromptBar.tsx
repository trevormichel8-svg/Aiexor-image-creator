"use client"

interface PromptBarProps {
  prompt: string
  setPrompt: (v: string) => void
  onGenerate: () => void
}

export default function PromptBar({
  prompt,
  setPrompt,
  onGenerate,
}: PromptBarProps) {
  return (
    <div
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        background:
          "linear-gradient(to top, rgba(11,11,15,0.98), rgba(11,11,15,0.7))",
        padding: "12px",
      }}
    >
      <div
        style={{
          maxWidth: 900,
          margin: "0 auto",
          display: "flex",
          gap: 10,
        }}
      >
        <input
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Describe your image…"
          style={{
            flex: 1,
            height: 52,
            borderRadius: 999,
            padding: "0 18px",
            fontSize: 16,
            background: "var(--bg-input)",
            color: "var(--text-main)",
            border: "1px solid rgba(255,255,255,0.08)",
            boxShadow: "0 0 14px rgba(20,184,166,0.35)",
          }}
        />

        <button
          onClick={onGenerate}
          style={{
            height: 52,
            minWidth: 90,
            padding: "0 18px",
            borderRadius: 999,
            background: "var(--accent)",
            color: "#022c28",
            fontWeight: 700,
            border: "none",
            boxShadow: "0 0 18px rgba(20,184,166,0.9)",
            cursor: "pointer",
          }}
        >
          Go
        </button>
      </div>
    </div>
  )
}
