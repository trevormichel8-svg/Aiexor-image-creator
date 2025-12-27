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
  const [showStyles, setShowStyles] = useState(false);

  return (
    <>
      {/* BOTTOM FIXED PROMPT BAR */}
      <div className="fixed bottom-0 left-0 right-0 z-40 px-3 pb-4">
        <div
          className="mx-auto flex items-center gap-2 max-w-3xl
                     bg-black border border-red-600/50
                     rounded-full px-3 py-2"
          style={{
            boxShadow: "0 0 22px rgba(255,0,0,0.55)",
          }}
        >
          {/* + BUTTON (CIRCLE) */}
          <button
            onClick={() => setShowStyles(true)}
            className="flex items-center justify-center
                       w-10 h-10 rounded-full
                       text-red-400 text-2xl"
            style={{
              boxShadow: "0 0 12px rgba(255,0,0,0.8)",
            }}
          >
            +
          </button>

          {/* INPUT */}
          <input
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder={`Style: ${style}`}
            className="flex-1 bg-transparent text-white
                       placeholder-gray-400 outline-none px-1"
          />

          {/* GENERATE BUTTON (CIRCLE) */}
          <button
            disabled={loading}
            onClick={() => onGenerate(prompt, style)}
            className="flex items-center justify-center
                       w-10 h-10 rounded-full
                       text-red-400 text-xl"
            style={{
              boxShadow: "0 0 12px rgba(255,0,0,0.8)",
            }}
          >
            {loading ? "…" : "↵"}
          </button>
        </div>
      </div>

      {/* ART STYLE SHEET */}
      <ArtStyleSheet
        open={showStyles}
        onSelect={setStyle}
        onClose={() => setShowStyles(false)}
      />
    </>
  );
}
