"use client";

import { useState } from "react";
import ArtStyleSheet from "./ArtStyleSheet";

type PromptBarProps = {
  onGenerate: (prompt: string, style: string, strength: number) => void;
  loading: boolean;
};

export default function PromptBar({ onGenerate, loading }: PromptBarProps) {
  const [prompt, setPrompt] = useState("");
  const [style, setStyle] = useState("Cinematic");
  const [strength, setStrength] = useState(70);
  const [showStyles, setShowStyles] = useState(false);

  function submit() {
    if (!prompt.trim() || loading) return;
    onGenerate(prompt.trim(), style, strength);
    setPrompt("");
  }

  return (
    <>
      {/* Art Style Sheet */}
      <ArtStyleSheet
        open={showStyles}
        onSelect={(s) => {
          setStyle(s);
          setShowStyles(false);
        }}
        onClose={() => setShowStyles(false)}
      />

      {/* Prompt Bar */}
      <div className="prompt-bar-wrapper">
        <div className="prompt-bar-glow">
          {/* Art Style Button */}
          <button
            type="button"
            aria-label="Art style"
            onClick={() => setShowStyles(true)}
            className="prompt-generate-btn"
          >
            +
          </button>

          {/* Prompt Input */}
          <input
            className="prompt-input"
            placeholder={`Describe your image (${style})`}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && submit()}
            disabled={loading}
          />

          {/* Generate Button */}
          <button
            type="button"
            aria-label="Generate"
            onClick={submit}
            disabled={loading}
            className="prompt-generate-btn"
          >
            {loading ? "…" : "▶"}
          </button>
        </div>
      </div>

      {/* Style Strength Slider */}
      <div className="fixed bottom-[72px] left-0 right-0 flex justify-center z-40">
        <div className="w-full max-w-md px-6">
          <input
            type="range"
            min={20}
            max={100}
            step={10}
            value={strength}
            onChange={(e) => setStrength(Number(e.target.value))}
            className="w-full accent-red-600"
          />
          <div className="text-center text-xs text-red-400 mt-1">
            Style strength: {strength}%
          </div>
        </div>
      </div>
    </>
  );
}
