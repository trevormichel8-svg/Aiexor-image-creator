"use client";

import { useState } from "react";
import ArtStyleSheet from "./ArtStyleSheet";

type PromptBarProps = {
  onGenerate: (prompt: string, style: string) => void;
  loading: boolean;
};

export default function PromptBar({ onGenerate, loading }: PromptBarProps) {
  const [prompt, setPrompt] = useState("");
  const [style, setStyle] = useState("Photorealistic");
  const [openStyles, setOpenStyles] = useState(false);

  return (
    <>
      {/* STYLE MENU */}
      {openStyles && (
        <ArtStyleSheet
          open={openStyles}
          onSelect={(s) => {
            setStyle(s);
            setOpenStyles(false);
          }}
          onClose={() => setOpenStyles(false)}
        />
      )}

      {/* BOTTOM PROMPT BAR */}
      <div className="prompt-bar-wrapper">
        <div className="prompt-bar-glow">
          {/* STYLE BUTTON */}
          <button
            className="prompt-generate-btn"
            onClick={() => setOpenStyles(true)}
            title="Choose art style"
            type="button"
          >
            +
          </button>

          {/* INPUT */}
          <input
            className="prompt-input"
            placeholder="Ask Aiexor…"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && prompt.trim()) {
                onGenerate(prompt, style);
              }
            }}
          />

          {/* GENERATE */}
          <button
            className="prompt-generate-btn"
            disabled={loading || !prompt.trim()}
            onClick={() => onGenerate(prompt, style)}
            title="Generate"
            type="button"
          >
            ↑
          </button>
        </div>
      </div>
    </>
  );
}
