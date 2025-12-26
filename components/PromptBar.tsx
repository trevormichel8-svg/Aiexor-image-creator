"use client";

import { useState } from "react";
import ArtStyleSheet from "./ArtStyleSheet";

type PromptBarProps = {
  onGenerate: (prompt: string, style: string) => Promise<void>;
  loading: boolean;
};

export default function PromptBar({ onGenerate, loading }: PromptBarProps) {
  const [prompt, setPrompt] = useState("");
  const [style, setStyle] = useState("Photorealistic");
  const [showStyles, setShowStyles] = useState(false);

  async function handleGenerate() {
    if (!prompt.trim() || loading) return;
    await onGenerate(prompt, style);
  }

  return (
    <>
      {/* Art style selector */}
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

      {/* Bottom prompt bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 p-3 bg-black/80 backdrop-blur">
        <div
          className="
            mx-auto flex items-center gap-2 max-w-3xl
            rounded-full px-3 py-2
            bg-neutral-900
            border border-red-600/60
            shadow-[0_0_20px_rgba(255,0,0,0.6)]
          "
        >
          {/* Style button */}
          <button
            onClick={() => setShowStyles(true)}
            className="
              flex h-9 w-9 items-center justify-center rounded-full
              border border-red-600/70
              text-red-500
              shadow-[0_0_12px_rgba(255,0,0,0.6)]
              hover:bg-red-600/10
            "
            title="Choose art style"
          >
            +
          </button>

          {/* Prompt input */}
          <input
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleGenerate();
            }}
            placeholder="Describe the image you want to create…"
            className="
              flex-1 bg-transparent outline-none text-white
              placeholder:text-neutral-400
            "
          />

          {/* Generate button */}
          <button
            onClick={handleGenerate}
            disabled={loading}
            className="
              flex h-9 w-9 items-center justify-center rounded-full
              border border-red-600/70
              text-white
              shadow-[0_0_14px_rgba(255,0,0,0.8)]
              hover:bg-red-600/20
              disabled:opacity-50
            "
            title="Generate image"
          >
            {loading ? "…" : "↑"}
          </button>
        </div>

        {/* Selected style label */}
        <div className="mt-1 text-center text-xs text-red-400">
          Style: {style}
        </div>
      </div>
    </>
  );
}
