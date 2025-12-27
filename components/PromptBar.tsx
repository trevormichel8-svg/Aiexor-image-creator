"use client";

import { useState } from "react";
import ArtStyleSheet from "./ArtStyleSheet";

type HistoryItem = {
  id: string;
  image: string;
  prompt: string;
  displayPrompt: string;
  style: string;
};

export default function PromptBar({
  onGenerate,
  loading,
}: {
  onGenerate: (compiledPrompt: string) => Promise<string>;
  loading: boolean;
}) {
  const [prompt, setPrompt] = useState("");
  const [style, setStyle] = useState("Photorealistic");
  const [showStyles, setShowStyles] = useState(false);
  const [history, setHistory] = useState<HistoryItem[]>([]);

  function buildPrompt(raw: string, style: string) {
    return `Style: ${style}.\n\n${raw}`;
  }

  async function handleGenerate() {
    if (!prompt.trim() || loading) return;

    const compiledPrompt = buildPrompt(prompt, style);

    const image = await onGenerate(compiledPrompt);

    setHistory((prev) => [
      {
        id: crypto.randomUUID(),
        image,
        prompt: compiledPrompt,
        displayPrompt: prompt,
        style,
      },
      ...prev,
    ]);

    setPrompt("");
  }

  return (
    <>
      {/* Image history */}
      <div className="w-full px-3 pt-4 space-y-6">
        {history.map((item) => (
          <div key={item.id}>
            <img
              src={`data:image/png;base64,${item.image}`}
              className="rounded-xl shadow-lg mx-auto"
              alt={item.displayPrompt}
            />
            <div className="text-xs text-white/60 mt-1">
              {item.displayPrompt} · {item.style}
            </div>
          </div>
        ))}
      </div>

      {/* Art style sheet */}
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

      {/* Prompt bar */}
      <div className="prompt-bar-wrapper">
        <div className="prompt-bar-glow">
          <button
            className="prompt-generate-btn"
            onClick={() => setShowStyles(true)}
            aria-label="Choose art style"
          >
            +
          </button>

          <input
            className="prompt-input"
            placeholder={`Ask Aiexor… (${style})`}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleGenerate()}
          />

          <button
            className="prompt-generate-btn"
            onClick={handleGenerate}
            disabled={loading}
            aria-label="Generate image"
          >
            ↑
          </button>
        </div>
      </div>
    </>
  );
}
