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
        background: "linear-gradient(to top, rgba(11,11,15,0.95), rgba(11,11,15,0.6))",
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
          style={{
            flex: 1,
            height: 56,
            borderRadius: 999,
            fontSize: 16,
          }}
          placeholder="Describe the image you want to generate…"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && onGenerate()}
        />

        <button
          className="primary"
          style={{ height: 56 }}
          onClick={onGenerate}
        >
          Generate
        </button>
      </div>
    </div>
  )
}
