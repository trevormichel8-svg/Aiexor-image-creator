"use client"

export type PromptBarProps = {
  onGenerate: () => void
  /**
   * The current prompt string controlled by the parent component. The bar
   * displays this value and updates it via the supplied setter when the
   * user types.
   */
  prompt: string
  /**
   * Setter for the prompt string. Invoked on each keystroke.
   */
  setPrompt: (value: string) => void
}

export default function PromptBar({ onGenerate, prompt, setPrompt }: PromptBarProps) {
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
