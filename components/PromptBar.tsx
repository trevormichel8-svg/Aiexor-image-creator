"use client";

import { useState } from "react";
import ArtStyleSheet from "./ArtStyleSheet";

type Props = {
  onGenerate: (compiledPrompt: string) => void;
  loading: boolean;
};

export default function PromptBar({ onGenerate, loading }: Props) {
  const [prompt, setPrompt] = useState("");
  const [style, setStyle] = useState("None");
  const [strength, setStrength] = useState(0.7);
  const [open, setOpen] = useState(false);

  function handleGenerate() {
    if (!prompt.trim()) return;

    const compiledPrompt =
      style === "None"
        ? prompt
        : `${prompt}, art style: ${style}, style strength ${strength}`;

    onGenerate(compiledPrompt);
    setPrompt("");
  }

  return (
    <>
      <div className="prompt-bar-wrapper">
        <div className="prompt-bar-glow">
          <button
            className="prompt-style-btn"
            onClick={() => setOpen(true)}
            title="Art styles"
          >
            +
          </button>

          <input
            className="prompt-input"
            placeholder="Describe the image…"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleGenerate()}
          />

          <button
            className="prompt-generate-btn"
            onClick={handleGenerate}
            disabled={loading}
          >
            →
          </button>
        </div>
      </div>

      <ArtStyleSheet
        open={open}
        selected={style}
        strength={strength}
        onSelect={setStyle}
        onStrength={setStrength}
        onClose={() => setOpen(false)}
      />
    </>
  );
}
