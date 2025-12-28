"use client";

import { useEffect, useState } from "react";
import PromptBar from "@/components/PromptBar";

type ImageItem = {
  id: string;
  src: string;
  prompt: string;
  style: string;
};

export default function Page() {
  const [images, setImages] = useState<ImageItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [fullscreen, setFullscreen] = useState<ImageItem | null>(null);

  // Load history
  useEffect(() => {
    const stored = localStorage.getItem("aiexor-history");
    if (stored) setImages(JSON.parse(stored));
  }, []);

  // Save history
  useEffect(() => {
    localStorage.setItem("aiexor-history", JSON.stringify(images));
  }, [images]);

  async function handleGenerate(compiledPrompt: string) {
    if (loading) return;

    try {
      setLoading(true);

      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: compiledPrompt }),
      });

      const data = await res.json();
      if (!data?.image) throw new Error("Generation failed");

      setImages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          src: `data:image/png;base64,${data.image}`,
          prompt: compiledPrompt,
          style: extractStyle(compiledPrompt),
        },
      ]);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  function clearHistory() {
    setImages([]);
  }

  function deleteImage(id: string) {
    setImages((prev) => prev.filter((i) => i.id !== id));
  }

  return (
    <main style={{ paddingBottom: 120 }}>
      {images.length > 0 && (
        <button
          onClick={clearHistory}
          style={{
            margin: 12,
            padding: "6px 14px",
            borderRadius: 8,
            background: "#1a1a1a",
            color: "white",
            border: "1px solid #333",
          }}
        >
          Clear history
        </button>
      )}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
          gap: 16,
          padding: 16,
        }}
      >
        {images.map((img) => (
          <div key={img.id}>
            <div style={{ fontSize: 12, opacity: 0.7 }}>
              Style: {img.style}
            </div>

            <div style={{ position: "relative" }}>
              <img
                src={img.src}
                alt={img.prompt}
                onClick={() => setFullscreen(img)}
                style={{
                  width: "100%",
                  borderRadius: 12,
                  cursor: "pointer",
                }}
              />

              <button
                onClick={() => deleteImage(img.id)}
                style={{
                  position: "absolute",
                  top: 8,
                  right: 8,
                  background: "#000a",
                  color: "white",
                  border: "none",
                  borderRadius: "50%",
                  width: 28,
                  height: 28,
                  cursor: "pointer",
                }}
              >
                ✕
              </button>
            </div>
          </div>
        ))}
      </div>

      {fullscreen && (
        <div
          onClick={() => setFullscreen(null)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.9)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 100,
          }}
        >
          <img
            src={fullscreen.src}
            style={{
              maxWidth: "95%",
              maxHeight: "95%",
              borderRadius: 12,
            }}
          />
        </div>
      )}

      <PromptBar onGenerate={handleGenerate} loading={loading} />
    </main>
  );
}

function extractStyle(prompt: string) {
  const match = prompt.match(/\[(.*?) style\]/i);
  return match ? match[1] : "Default";
}
