"use client";

import { useState } from "react";
import ArtStyleSheet from "./ArtStyleSheet";

type Props = {
  onGenerate: (compiledPrompt: string) => Promise<void>;
  loading: boolean;
};

export default function PromptBar({ onGenerate, loading }: Props) {
  const [prompt, setPrompt] = useState("");
  const [style, setStyle] = useState("Default");
  const [showStyles, setShowStyles] = useState(false);

  async function handleSubmit() {
    if (!prompt.trim() || loading) return;

    const compiledPrompt =
      style && style !== "Default"
        ? `${prompt} · Style: ${style}`
        : prompt;

    await onGenerate(compiledPrompt);
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
          >
            +
          </button>

          <input
            className="prompt-input"
            placeholder={`Ask Aiexor... (${style})`}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
          />

          <button
            className="prompt-generate-btn"
            onClick={handleSubmit}
            disabled={loading}
          >
            ↑
          </button>
        </div>
      </div>
    </>
  );
}
