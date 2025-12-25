"use client";

import { useState } from "react";
import ArtStyleSheet from "./ArtStyleSheet";

type PromptBarProps = {
  onGenerate: (prompt: string, style: string) => void;
  loading: boolean;
};

export default function PromptBar({ onGenerate, loading }: PromptBarProps) {
  const [prompt, setPrompt] = useState("");
  const [style, setStyle] = useState("");
  const [stylesOpen, setStylesOpen] = useState(false);

  function handleGenerate() {
    if (!prompt.trim() || loading) return;
    onGenerate(prompt.trim(), style);
    setPrompt("");
  }

  return (
    <>
      {/* Art Style Selector */}
      <ArtStyleSheet
        open={stylesOpen}
        onSelect={(s) => setStyle(s)}
        onClose={() => setStylesOpen(false)}
      />

      {/* Prompt Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 p-4 bg-black">
        <div
          className="
            mx-auto max-w-3xl
            flex items-center gap-3
            rounded-full
            bg-zinc-900
            px-4 py-3
            border border-red-600/60
            shadow-[0_0_30px_rgba(255,0,0,0.6)]
          "
        >
          {/* Art Style Button */}
          <button
            type="button"
            onClick={() => setStylesOpen(true)}
            className="
              text-red-500 text-xl font-bold
              hover:text-red-400
              transition
            "
            title="Art styles"
          >
            +
          </button>

          {/* Prompt Input */}
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder={
              style
                ? `Style: ${style} — describe your image...`
                : "Describe what you want to create..."
            }
            rows={1}
            className="
              flex-1
              resize-none
              bg-transparent
              text-white
              placeholder-zinc-400
              outline-none
              text-sm sm:text-base
            "
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleGenerate();
              }
            }}
          />

          {/* Generate Button */}
          <button
            type="button"
            onClick={handleGenerate}
            disabled={loading}
            className={`
              text-red-500 font-bold
              transition
              ${loading ? "opacity-50 cursor-not-allowed" : "hover:text-red-400"}
            `}
            title="Generate"
          >
            {loading ? "…" : "⬆"}
          </button>
        </div>
      </div>
    </>
  );
}
