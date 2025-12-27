"use client";

import { useState } from "react";
import PromptBar from "@/components/PromptBar";

type ImageItem = {
  prompt: string;
  style: string;
  image: string;
};

export default function Page() {
  const [images, setImages] = useState<ImageItem[]>([]);
  const [loading, setLoading] = useState(false);

  async function generate(compiledPrompt: string): Promise<string> {
    setLoading(true);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: compiledPrompt }),
      });

      if (!res.ok) {
        throw new Error("Generation failed");
      }

      const data = await res.json();
      return data.image;
    } finally {
      setLoading(false);
    }
  }

  async function handleGenerate(prompt: string, style: string) {
    const compiledPrompt = style
      ? `${prompt} · ${style}`
      : prompt;

    const image = await generate(compiledPrompt);

    setImages((prev) => [
      {
        prompt,
        style,
        image,
      },
      ...prev,
    ]);
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "black",
        paddingBottom: "120px",
      }}
    >
      {/* Image history */}
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
        {images.map((img, idx) => (
          <div key={idx}>
            <div
              style={{
                marginBottom: "8px",
                color: "#fff",
                opacity: 0.9,
              }}
            >
              {img.prompt}
              {img.style && (
                <span style={{ opacity: 0.6 }}>
                  {" "}
                  · {img.style}
                </span>
              )}
            </div>

            <img
              src={
                img.image.startsWith("data:image")
                  ? img.image
                  : `data:image/png;base64,${img.image}`
              }
              alt={img.prompt}
              style={{
                width: "100%",
                borderRadius: "12px",
                display: "block",
              }}
            />
          </div>
        ))}
      </div>

      {/* Bottom prompt bar */}
      <PromptBar onGenerate={handleGenerate} loading={loading} />
    </main>
  );
}
