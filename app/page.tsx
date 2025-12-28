"use client";

import { useState } from "react";
import PromptBar from "@/components/PromptBar";

type GeneratedImage = {
  id: string;
  prompt: string;
  image: string;
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

      if (!res.ok) {
        throw new Error("Generation failed");
      }

      const data = await res.json();

      setImages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          prompt: compiledPrompt,
          image: data.image,
        },
      ]);
    } catch (e) {
      console.error("Image generation error:", e);
      // ❗ NO return here
    } finally {
      setLoading(false);
    }
  }

  return (
    <main style={{ paddingBottom: "120px" }}>
      {images.map((img) => (
        <div key={img.id} style={{ marginBottom: 24 }}>
          <div style={{ opacity: 0.6, fontSize: 14 }}>{img.prompt}</div>
          <img
            src={img.image}
            alt={img.prompt}
            style={{
              width: "100%",
              maxWidth: 480,
              borderRadius: 12,
              marginTop: 8,
            }}
          />
        </div>
      ))}

      <PromptBar onGenerate={handleGenerate} loading={loading} />
    </main>
  );
}
