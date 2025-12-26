"use client";

import { useState } from "react";

type PromptBarProps = {
  onGenerate: (prompt: string) => void;
  loading: boolean;
};

export default function PromptBar({ onGenerate, loading }: PromptBarProps) {
  const [prompt, setPrompt] = useState("");

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 w-[95%] max-w-xl flex gap-2">
      <input
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Describe the image you want..."
        className="flex-1 px-4 py-2 rounded border border-gray-400"
      />

      <button
        disabled={loading}
        onClick={() => onGenerate(prompt)}
        className="px-4 py-2 bg-white border border-gray-400 rounded"
      >
        {loading ? "..." : "Generate"}
      </button>
    </div>
  );
}
