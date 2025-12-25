"use client";

import { useState } from "react";
import ArtStyleSheet from "./ArtStyleSheet";

export default function PromptBar({
  onGenerate,
}: {
  onGenerate: (prompt: string, style: string) => void;
}) {
  const [prompt, setPrompt] = useState("");
  const [style, setStyle] = useState("");
  const [open, setOpen] = useState(false);

  return (
    <>
      <ArtStyleSheet
        open={open}
        onSelect={setStyle}
        onClose={() => setOpen(false)}
      />

      <div className="fixed bottom-0 left-0 right-0 p-4 bg-black">
        <div className="flex items-center gap-3 bg-zinc-900 rounded-full px-4 py-3 border border-red-600 shadow-[0_0_25px_rgba(255,0,0,0.5)]">
          <button
            onClick={() => setOpen(true)}
            className="text-red-500 text-xl font-bold"
          >
            +
          </button>

          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder={
              style ? `Style: ${style}` : "Describe what you want to create..."
            }
            className="flex-1 bg-transparent text-white resize-none outline-none"
            rows={1}
          />

          <button
            onClick={() => onGenerate(prompt, style)}
            className="text-red-500 font-bold"
          >
            ⬆
          </button>
        </div>
      </div>
    </>
  );
}
