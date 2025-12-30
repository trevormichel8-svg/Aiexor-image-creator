"use client";

import { useState } from "react";

type PromptBarProps = {
  loading: boolean;
  onGenerate: (prompt: string) => void;
};

export default function PromptBar({ loading, onGenerate }: PromptBarProps) {
  const [prompt, setPrompt] = useState("");

  return (
    <div className="prompt-bar-wrapper">
      <div className="prompt-bar-glow">
        <input
          className="prompt-input"
          placeholder="Describe your image..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />

        <button
          className="prompt-generate-btn"
          disabled={loading || !prompt}
          onClick={() => {
            onGenerate(prompt);
            setPrompt("");
          }}
        >
          →
        </button>
      </div>
    </div>
  );
}
