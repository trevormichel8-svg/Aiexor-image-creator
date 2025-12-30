"use client";

import { useState } from "react";
import PromptBar from "@/components/PromptBar";

type GeneratedImage = {
  id: string;
  prompt: string;
  style: string;
  image: string;
};

export default function Page() {
  const [images, setImages] = useState<GeneratedImage[]>([]);
  const [loading, setLoading] = useState(false);

  // 🔥 REAL generator (internal)
  async function handleGenerateInternal(
    prompt: string,
    style: string,
    strength: number
  ) {
    setLoading(true);

    try {
      const compiledPrompt =
        strength > 0
          ? `${prompt}, ${style}, style strength ${strength}%`
          : `${prompt}, ${style}`;

      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: compiledPrompt }),
      });

      const data = await res.json();

      if (!data?.image) return;

      setImages((prev) => [
        {
          id: crypto.randomUUID(),
          prompt,
          style,
          image: `data:image/png;base64,${data.image}`,
        },
        ...prev,
      ]);
    } finally {
      setLoading(false);
    }
  }

  // ✅ ADAPTER — matches PromptBar type EXACTLY
  async function handleGenerate(compiledPrompt: string) {
    // split back out (PromptBar controls formatting)
    await handleGenerateInternal(compiledPrompt, "Default", 100);
  }

  return (
    <>
      <main className="canvas">
        {images.length === 0 && (
          <div className="empty-state">Generate your first image</div>
        )}

        {images.map((img) => (
          <div key={img.id} className="message">
            <img
              src={img.image}
              alt={img.prompt}
              className="generated-image"
            />
            <div className="caption">
              {img.prompt} · <span className="style">{img.style}</span>
            </div>
          </div>
        ))}
      </main>

      {/* ✅ PromptBar now receives EXACTLY what it expects */}
      <PromptBar onGenerate={handleGenerate} loading={loading} />
    </>
  );
}
