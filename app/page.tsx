"use client";

import { useState } from "react";
import PromptBar from "@/components/PromptBar";

type GeneratedImage = {
  id: string;
  prompt: string;
  image: string; // base64
};

export default function Page() {
  const [images, setImages] = useState<GeneratedImage[]>([]);
  const [loading, setLoading] = useState(false);

  async function handleGenerate(compiledPrompt: string): Promise<void> {
    try {
      setLoading(true);

      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: compiledPrompt }),
      });

      if (!res.ok) throw new Error("Generation failed");

      const data = await res.json();

      setImages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          prompt: compiledPrompt,
          image: data.image, // base64 only
        },
      ]);
    } catch (e) {
      console.error("Generation error:", e);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main style={{ paddingBottom: 120 }}>
      {images.map((img) => (
        <div key={img.id} style={{ marginBottom: 28 }}>
          <div style={{ opacity: 0.65, fontSize: 14 }}>
            {img.prompt}
          </div>

          <img
            src={`data:image/png;base64,${img.image}`}
            alt={img.prompt}
            style={{
              width: "100%",
              maxWidth: 480,
              borderRadius: 14,
              marginTop: 8,
              display: "block",
            }}
          />
        </div>
      ))}

      <PromptBar onGenerate={handleGenerate} loading={loading} />
    </main>
  );
}
