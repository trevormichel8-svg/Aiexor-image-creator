"use client";

import { useState } from "react";
import PromptBar from "@/components/PromptBar";

type HistoryItem = {
  id: string;
  prompt: string;
  image: string;
};

export default function Page() {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(false);

  async function handleGenerate(compiledPrompt: string) {
    try {
      setLoading(true);

      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: compiledPrompt }),
      });

      const data = await res.json();

      setHistory((h) => [
        {
          id: crypto.randomUUID(),
          prompt: compiledPrompt,
          image: `data:image/png;base64,${data.image}`,
        },
        ...h,
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main>
      <div className="canvas">
        {history.length === 0 && (
          <div className="empty-state">Create your first image</div>
        )}

        {history.map((item) => (
          <div key={item.id} className="message">
            <img src={item.image} className="generated-image" />
            <div className="caption">{item.prompt}</div>
          </div>
        ))}
      </div>

      <PromptBar onGenerate={handleGenerate} loading={loading} />
    </main>
  );
}
