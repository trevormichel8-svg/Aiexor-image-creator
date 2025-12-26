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
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 w-[95%] max-w-3xl z-40">
        <div
          className="flex items-center gap-2 bg-black rounded-full px-3 py-2 border border-red-600/50"
          style={{ boxShadow: "0 0 20px rgba(255,0,0,0.5)" }}
        >
          {/* + Button */}
          <button
            onClick={() => setShowStyles(true)}
            className="text-red-400 text-2xl px-2"
            style={{ textShadow: "0 0 10px rgba(255,0,0,0.8)" }}
          >
            +
          </button>

          {/* Input */}
          <input
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder={`Style: ${style}`}
            className="flex-1 bg-transparent outline-none text-white placeholder-gray-400"
          />

          {/* Generate */}
          <button
            disabled={loading}
            onClick={() => onGenerate(prompt, style)}
            className="text-red-400 px-3"
            style={{ textShadow: "0 0 10px rgba(255,0,0,0.8)" }}
          >
            {loading ? "…" : "↵"}
          </button>
        </div>
      </div>

      <ArtStyleSheet
        open={showStyles}
        onSelect={setStyle}
        onClose={() => setShowStyles(false)}
      />
    </>
  );
}
