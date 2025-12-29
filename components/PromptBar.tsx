"use client";

import { useState } from "react";

type PromptBarProps = {
  onGenerate: (prompt: string) => void;
  loading?: boolean;
};

export default function PromptBar({ onGenerate, loading }: PromptBarProps) {
  const [prompt, setPrompt] = useState("");
  const [styleStrength, setStyleStrength] = useState(70);

  function handleSubmit() {
    if (!prompt.trim() || loading) return;
    onGenerate(prompt);
    setPrompt("");
  }

  return (
    <div className="prompt-bar-wrapper">
      <div className="prompt-bar-glow">
        <input
          className="prompt-input"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Describe your image..."
          disabled={loading}
        />

        <button
          className="send-btn"
          onClick={handleSubmit}
          disabled={loading}
        >
          ➤
        </button>
      </div>

      <div className="style-slider">
        <label>Style</label>
        <input
          type="range"
          min={0}
          max={100}
          value={styleStrength}
          onChange={(e) => setStyleStrength(Number(e.target.value))}
        />
        <span>{styleStrength}%</span>
      </div>
    </div>
  );
}
