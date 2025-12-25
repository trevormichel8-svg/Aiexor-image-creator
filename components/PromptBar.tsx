"use client";

import { useState } from "react";
import ArtStyleSheet from "./ArtStyleSheet";

export type PromptBarProps = {
  onGenerate: (prompt: string, style: string) => void | Promise<void>;
  loading: boolean;
};

export default function PromptBar({ onGenerate, loading }: PromptBarProps) {
  const [prompt, setPrompt] = useState("");
  const [style, setStyle] = useState("Photorealistic");
  const [showStyles, setShowStyles] = useState(false);

  return (
    <>
      {/* Art style bottom sheet */}
      {showStyles && (
        <ArtStyleSheet
          selected={style}
          onSelect={(s) => {
            setStyle(s);
            setShowStyles(false);
          }}
          onClose={() => setShowStyles(false)}
        />
      )}

      {/* Bottom prompt bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-black/80 backdrop-blur border-t border-red-600/40 px-3 py-3">
        <div className="flex items-center gap-2 max-w-4xl mx-auto">
          {/* Style button */}
          <button
            onClick={() => setShowStyles(true)}
            className="h-10 w-10 rounded-full border border-red-500 text-red-400 shadow-[0_0_12px_rgba(255,0,0,0.6)] flex items-center justify-center"
          >
            +
          </button>

          {/* Prompt input */}
          <input
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe the image you want to create…"
            className="flex-1 h-10 px-4 rounded-full bg-zinc-900 text-white border border-red-500 shadow-[0_0_14px_rgba(255,0,0,0.6)] outline-none"
          />

          {/* Generate */}
          <button
            disabled={loading || !prompt}
            onClick={() => onGenerate(prompt, style)}
            className="h-10 px-4 rounded-full bg-red-600 text-white font-medium shadow-[0_0_18px_rgba(255,0,0,0.8)] disabled:opacity-50"
          >
            {loading ? "…" : "↑"}
          </button>
        </div>
      </div>
    </>
  );
}
