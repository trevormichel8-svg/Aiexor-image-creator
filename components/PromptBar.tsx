"use client";

import { useState } from "react";
import ArtStyleSheet from "./ArtStyleSheet";

type Props = {
  onGenerate: (prompt: string, style: string) => void;
  loading: boolean;
};

export default function PromptBar({ onGenerate, loading }: Props) {
  const [prompt, setPrompt] = useState("");
  const [style, setStyle] = useState("Photorealistic");
  const [showStyles, setShowStyles] = useState(false);

  function handleGenerate() {
    if (!prompt.trim()) return;

    // 🔑 THIS IS THE FIX:
    const styledPrompt =
      style && style !== "None"
        ? `${prompt}, in ${style} style`
        : prompt;

    onGenerate(styledPrompt, style);
    setPrompt("");
  }

  return (
    <>
      {showStyles && (
        <ArtStyleSheet
          open={showStyles}
          onSelect={(s) => {
            setStyle(s);
            setShowStyles(false);
          }}
          onClose={() => setShowStyles(false)}
        />
      )}

      <div className="prompt-bar-wrapper">
        <div className="prompt-bar-glow">
          <button
            className="prompt-generate-btn"
            onClick={() => setShowStyles(true)}
            title="Art styles"
          >
            +
          </button>

          <input
            className="prompt-input"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder={`Ask Aiexor… (${style})`}
            onKeyDown={(e) => e.key === "Enter" && handleGenerate()}
          />

          <button
            className="prompt-generate-btn"
            onClick={handleGenerate}
            disabled={loading}
            title="Generate"
          >
            ↑
          </button>
        </div>
      </div>
    </>
  );
}
