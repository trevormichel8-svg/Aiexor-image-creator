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
        padding: "16px",
      }}
    >
      <div
        style={{
          maxWidth: 900,
          margin: "0 auto",
          display: "flex",
          gap: 12,
        }}
      >
        <input
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && onGenerate()}
          placeholder="Describe the image you want to generate…"
          style={{
            flex: 1,
            height: 56,
            borderRadius: 999,
            padding: "0 20px",
            fontSize: 16,
            background: "var(--bg-input)",
            color: "var(--text-main)",
            border: "1px solid rgba(255,255,255,0.08)",
            boxShadow: "0 0 16px rgba(20,184,166,0.25)",
          }}
        />

        <button
          onClick={onGenerate}
          style={{
            height: 56,
            padding: "0 26px",
            borderRadius: 999,
            background: "var(--accent)",
            color: "#022c28",
            fontWeight: 700,
            border: "none",
            cursor: "pointer",
            boxShadow: "0 0 18px rgba(20,184,166,0.8)",
          }}
        >
          Generate
        </button>
      </div>
    </div>
  )
}
