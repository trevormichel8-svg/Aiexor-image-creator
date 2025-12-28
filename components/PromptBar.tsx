"use client";

import { useState } from "react";
import ArtStyleSheet from "./ArtStyleSheet";

type Props = {
  onGenerate: (prompt: string, style: string, strength: number) => void;
  loading: boolean;
};

export default function PromptBar({ onGenerate, loading }: Props) {
  const [prompt, setPrompt] = useState("");
  const [style, setStyle] = useState("Photorealistic");
  const [strength, setStrength] = useState(70);
  const [showStyles, setShowStyles] = useState(false);

  function submit() {
    if (!prompt.trim() || loading) return;
    onGenerate(prompt, style, strength);
    setPrompt("");
  }

  return (
    <>
      {showStyles && (
        <ArtStyleSheet
          open={showStyles}
          onSelect={s => {
            setStyle(s);
            setShowStyles(false);
          }}
          onClose={() => setShowStyles(false)}
        />
      )}

      <div className="prompt-bar-wrapper">
        <div className="prompt-bar-glow">
          {/* Style button */}
          <button
            onClick={() => setShowStyles(true)}
            className="prompt-generate-btn"
            title="Art Style"
          >
            🎨
          </button>

          {/* Input */}
          <input
            value={prompt}
            onChange={e => setPrompt(e.target.value)}
            onKeyDown={e => e.key === "Enter" && submit()}
            placeholder="Describe your image..."
            className="prompt-input"
          />

          {/* Generate */}
          <button
            onClick={submit}
            disabled={loading}
            className="prompt-generate-btn"
            title="Generate"
          >
            {loading ? "…" : "➜"}
          </button>
        </div>

        {/* Strength slider */}
        <div className="mt-2 flex items-center gap-2 text-xs text-red-400 justify-center">
          <span>Style</span>
          <input
            type="range"
            min={0}
            max={100}
            value={strength}
            onChange={e => setStrength(+e.target.value)}
            className="w-40 accent-red-600"
          />
          <span>{strength}%</span>
        </div>
      </div>
    </>
  );
}
