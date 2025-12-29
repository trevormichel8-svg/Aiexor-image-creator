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
          image: data.image,
        },
      ]);
    } catch (e) {
      console.error("Generation error:", e);
    } finally {
      setLoading(false);
    }
  }

  function clearHistory() {
    setImages([]);
  }

  function deleteImage(id: string) {
    setImages((prev) => prev.filter((img) => img.id !== id));
  }

  return (
    <main style={{ paddingBottom: 140 }}>
      {/* Header actions */}
      {images.length > 0 && (
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            padding: "12px 16px",
          }}
        >
          <button
            onClick={clearHistory}
            style={{
              background: "rgba(255,0,0,0.15)",
              border: "1px solid rgba(255,0,0,0.4)",
              color: "#ff5a5a",
              padding: "6px 12px",
              borderRadius: 10,
              cursor: "pointer",
            }}
          >
            Clear history
          </button>
        </div>
      )}

      {/* Image history */}
      {images.map((img) => (
        <div
          key={img.id}
          style={{
            marginBottom: 28,
            position: "relative",
            paddingLeft: 16,
            paddingRight: 16,
          }}
        >
          {/* Delete single image */}
          <button
            onClick={() => deleteImage(img.id)}
            style={{
              position: "absolute",
              top: 4,
              right: 20,
              background: "rgba(0,0,0,0.6)",
              border: "1px solid rgba(255,255,255,0.2)",
              color: "#fff",
              borderRadius: 999,
              width: 28,
              height: 28,
              cursor: "pointer",
            }}
            title="Delete image"
          >
            ✕
          </button>

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

      {/* Bottom prompt bar */}
      <PromptBar onGenerate={handleGenerate} loading={loading} />
    </main>
  );
}
