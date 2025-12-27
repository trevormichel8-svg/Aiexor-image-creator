"use client";

import { useState } from "react";
import PromptBar from "@/components/PromptBar";

type ImageItem = {
  prompt: string;
  image: string;
};

export default function Page() {
  const [images, setImages] = useState<ImageItem[]>([]);
  const [loading, setLoading] = useState(false);

  // ✅ EXACT SIGNATURE PROMPTBAR EXPECTS
  async function onGenerate(compiledPrompt: string): Promise<string> {
    setLoading(true);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: compiledPrompt }),
      });

      if (!res.ok) {
        throw new Error("Image generation failed");
      }

      const data = await res.json();
      const image = data.image as string;

      setImages((prev) => [
        { prompt: compiledPrompt, image },
        ...prev,
      ]);

      return image;
    } finally {
      setLoading(false);
    }
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "black",
        paddingBottom: "140px",
      }}
    >
      {/* IMAGE HISTORY */}
      <div
        style={{
          maxWidth: "900px",
          margin: "0 auto",
          padding: "16px",
          display: "flex",
          flexDirection: "column",
          gap: "24px",
        }}
      >
        {images.map((item, idx) => (
          <div key={idx}>
            <div style={{ color: "#fff", marginBottom: "8px", opacity: 0.8 }}>
              {item.prompt}
            </div>

            <img
              src={
                item.image.startsWith("data:image")
                  ? item.image
                  : `data:image/png;base64,${item.image}`
              }
              alt={item.prompt}
              style={{
                width: "100%",
                borderRadius: "12px",
                display: "block",
              }}
            />
          </div>
        ))}
      </div>

      {/* PROMPT BAR */}
      <PromptBar onGenerate={onGenerate} loading={loading} />
    </main>
  );
}
