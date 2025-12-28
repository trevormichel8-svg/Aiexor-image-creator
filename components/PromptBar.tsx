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

  async function submit() {
    if (!prompt.trim()) return;

    const compiled =
      style === "Default"
        ? prompt
        : `${prompt} [${style} style]`;

    setPrompt("");
    await onGenerate(compiled);
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
            placeholder={`Ask Aiexor… (${style})`}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && submit()}
          />

          <button
            className="prompt-generate-btn"
            disabled={loading}
            onClick={submit}
          >
            ↑
          </button>
        </div>
      </div>
    </>
  );
}
