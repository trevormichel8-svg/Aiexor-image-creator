"use client";

import { useState } from "react";
import ArtStyleSheet from "./ArtStyleSheet";

export default function PromptBar({
  onGenerate,
  loading
}: {
  onGenerate: (prompt: string, style: string) => void;
  loading: boolean;
}) {
  const [prompt, setPrompt] = useState("");
  const [style, setStyle] = useState("Default");
  const [showStyles, setShowStyles] = useState(false);

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
            placeholder={`Ask Aiexor… (${style})`}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            disabled={loading}
          />

          <button
            className="prompt-generate-btn"
            disabled={loading || !prompt.trim()}
            onClick={() => {
              onGenerate(prompt, style);
              setPrompt("");
            }}
          >
            →
          </button>
        </div>
      </div>
    </>
  );
}
