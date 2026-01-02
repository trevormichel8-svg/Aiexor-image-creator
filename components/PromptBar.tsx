"use client"

import { useImageSettings } from "@/lib/useImageSettings"

export default function PromptBar({ onGenerate }: { onGenerate: () => void }) {
  const { prompt, setPrompt } = useImageSettings()

  return (
    <div className="prompt-bar-wrapper">
      <div className="prompt-bar-glow">
        <input
          className="prompt-input"
          placeholder="Describe your image…"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />
        <button className="prompt-generate-btn" onClick={onGenerate}>
          <span className="generate-arrow">→</span>
        </button>
      </div>
    </div>
  )
}
