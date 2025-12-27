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
  const [open, setOpen] = useState(false);

  return (
    <>
      <ArtStyleSheet
        open={open}
        onClose={() => setOpen(false)}
        onSelect={(s) => {
          setStyle(s);
          setOpen(false);
        }}
      />

      <div className="prompt-bar-wrapper">
        <div className="prompt-bar-glow">
          <button
            className="prompt-generate-btn"
            onClick={() => setOpen(true)}
            title="Art styles"
          >
            +
          </button>

          <input
            className="prompt-input"
            placeholder={`Ask Aiexor… (${style})`}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />

          <button
            className="prompt-generate-btn"
            disabled={loading || !prompt}
            onClick={() => {
              if (!prompt) return;
              onGenerate(prompt, style);
              setPrompt("");
            }}
          >
            ↑
          </button>
        </div>
      </div>
    </>
  );
}
