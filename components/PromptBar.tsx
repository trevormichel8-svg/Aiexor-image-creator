"use client";

import { useState } from "react";
import ArtStyleSheet from "./ArtStyleSheet";

type Props = {
  onGenerate: (prompt: string, style: string) => void;
  loading: boolean;
};

export default function PromptBar({ onGenerate, loading }: Props) {
  const [prompt, setPrompt] = useState("");
  const [style, setStyle] = useState("");
  const [showStyles, setShowStyles] = useState(false);

  return (
    <>
        <ArtStyleSheet
          open={showStyles}
          onSelect={(s) => {
            setStyle(s);
            setShowStyles(false);
          }}
          onClose={() => setShowStyles(false)}
        />
      

      <div className="prompt-bar-wrapper">
        <div className="prompt-bar-glow">
          {/* STYLE BUTTON */}
          <button
            className="prompt-generate-btn"
            onClick={() => setShowStyles(true)}
            title="Styles"
          >
            +
          </button>

          {/* INPUT */}
          <input
            className="prompt-input"
            placeholder="Ask Aiexor..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />

          {/* GENERATE */}
          <button
            className="prompt-generate-btn"
            disabled={loading}
            onClick={() => onGenerate(prompt, style)}
            title="Generate"
          >
            ↑
          </button>
        </div>
      </div>
    </>
  );
}
