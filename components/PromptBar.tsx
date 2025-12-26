"use client";

import { useState } from "react";

interface PromptBarProps {
  onGenerate: (prompt: string) => void;
  loading: boolean;
}

export default function PromptBar({ onGenerate, loading }: PromptBarProps) {
  const [prompt, setPrompt] = useState("");

  const handleSubmit = () => {
    if (!prompt.trim() || loading) return;
    onGenerate(prompt);
    setPrompt("");
  };

  return (
    <div className="prompt-bar-wrapper">
      <div className="prompt-bar-glow">
        <input
          className="prompt-input"
          placeholder="Ask Aiexor…"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
        />

        <button
          className="prompt-generate-btn"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? "…" : "→"}
        </button>
      </div>
    </div>
  );
}
