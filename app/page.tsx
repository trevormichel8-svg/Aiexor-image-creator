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

  async function handleGenerate(compiledPrompt: string): Promise<string> {
    try {
      setLoading(true);

      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: compiledPrompt }),
      });

      if (!res.ok) throw new Error("Generation failed");

      const data = await res.json();

      const styleMatch = compiledPrompt.match(/Style:\s*(.+)$/i);
      const style = styleMatch ? styleMatch[1] : "Default";

      setImages((prev) => [
        ...prev,
        {
          prompt: compiledPrompt.replace(/Style:\s*.+$/i, "").trim(),
          style,
          image: data.image,
        },
      ]);

      return data.image;
    } catch (e) {
      console.error(e);
      return "";
    } finally {
      setLoading(false);
    }
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "black",
        paddingBottom: "120px",
      }}
    >
      {/* IMAGE HISTORY */}
      <div
        style={{
          maxWidth: "720px",
          margin: "0 auto",
          padding: "16px",
          display: "flex",
          flexDirection: "column",
          gap: "32px",
        }}
      >
        {images.map((item, i) => (
          <div
            key={i}
            style={{
              background: "#0b0b0b",
              borderRadius: "16px",
              padding: "12px",
              boxShadow: "0 0 0 1px rgba(255,255,255,0.05)",
            }}
          >
            {/* Caption */}
            <div
              style={{
                fontSize: "14px",
                color: "#bbb",
                marginBottom: "8px",
              }}
            >
              <strong>{item.prompt}</strong>
              <span style={{ opacity: 0.6 }}> · {item.style}</span>
            </div>

            {/* Image */}
            <img
              src={
                item.image.startsWith("data:image")
                  ? item.image
                  : `data:image/png;base64,${item.image}`
              }
              alt={item.prompt}
              style={{
                width: "100%",
                maxHeight: "420px",
                objectFit: "contain",
                borderRadius: "12px",
                background: "black",
                display: "block",
              }}
            />
          </div>
        ))}
      </div>

      {/* PROMPT BAR */}
      <PromptBar onGenerate={handleGenerate} loading={loading} />
    </main>
  );
}
