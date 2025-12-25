"use client";

import { useState } from "react";
import ArtStyleSheet from "./ArtStyleSheet";

type PromptBarProps = {
  onImageGenerated: (url: string) => void;
};

export default function PromptBar({ onImageGenerated }: PromptBarProps) {
  const [prompt, setPrompt] = useState("");
  const [style, setStyle] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showStyles, setShowStyles] = useState(false);

  async function generateImage() {
    if (!prompt.trim() || loading) return;

    setLoading(true);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt,
          style,
        }),
      });

      const data = await res.json();

      if (data?.imageUrl) {
        onImageGenerated(data.imageUrl);
        setPrompt("");
      }
    } catch (err) {
      console.error("Generate failed:", err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {/* ART STYLE MODAL */}
      {showStyles && (
        <ArtStyleSheet
          onSelect={(s) => {
            setStyle(s);
            setShowStyles(false);
          }}
          onClose={() => setShowStyles(false)}
        />
      )}

      {/* PROMPT BAR */}
      <div className="fixed bottom-0 left-0 right-0 z-40 px-3 pb-3">
        <div
          className="
            flex items-center gap-2
            bg-neutral-900
            rounded-full
            px-3 py-2
            border border-red-600/50
            shadow-[0_0_20px_rgba(220,38,38,0.8)]
          "
        >
          {/* + STYLE BUTTON */}
          <button
            onClick={() => setShowStyles(true)}
            className="
              flex items-center justify-center
              w-9 h-9
              rounded-full
              border border-red-600/60
              text-red-400
              shadow-[0_0_12px_rgba(220,38,38,0.9)]
              active:scale-95
            "
          >
            +
          </button>

          {/* PROMPT INPUT */}
          <input
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder={
              style ? `Style: ${style}` : "Describe the image you want to create…"
            }
            className="
              flex-1
              bg-transparent
              text-white
              placeholder-neutral-400
              outline-none
              text-sm
            "
            onKeyDown={(e) => {
              if (e.key === "Enter") generateImage();
            }}
          />

          {/* GENERATE BUTTON */}
          <button
            onClick={generateImage}
            disabled={loading}
            className="
              px-4 py-2
              rounded-full
              bg-red-600
              text-white
              text-sm font-medium
              shadow-[0_0_20px_rgba(220,38,38,1)]
              disabled:opacity-50
              active:scale-95
            "
          >
            {loading ? "…" : "Generate"}
          </button>
        </div>
      </div>
    </>
  );
}
