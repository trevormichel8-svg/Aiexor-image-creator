"use client";

import { useState } from "react";
import PromptBar from "@/components/PromptBar";

type ImageItem = {
  prompt: string;
  style: string;
  image: string; // base64 (no data: prefix required)
};

export default function Page() {
  const [images, setImages] = useState<ImageItem[]>([]);
  const [loading, setLoading] = useState(false);

  /**
   * IMPORTANT:
   * PromptBar calls onGenerate with a SINGLE compiled prompt string.
   * That compiled prompt already includes the style.
   */
  async function handleGenerate(compiledPrompt: string): Promise<string> {
    try {
      setLoading(true);

      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: compiledPrompt }),
      });

      if (!res.ok) {
        throw new Error("Image generation failed");
      }

      const data = await res.json();

      // Expecting base64 image from API
      const imageBase64 = data.image;

      // Extract style label if present (purely for UI/history)
      const styleMatch = compiledPrompt.match(/Style:\s*(.+)$/i);
      const style = styleMatch ? styleMatch[1] : "Default";

      setImages((prev) => [
        {
          prompt: compiledPrompt.replace(/Style:\s*.+$/i, "").trim(),
          style,
          image: imageBase64,
        },
        ...prev,
      ]);

      return imageBase64;
    } catch (err) {
      console.error(err);
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
        paddingBottom: "120px", // reserve space for prompt bar
      }}
    >
      {/* IMAGE HISTORY */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "24px",
          padding: "16px",
        }}
      >
        {images.map((item, index) => (
          <div key={index}>
            {/* Caption */}
            <div
              style={{
                color: "#bbb",
                fontSize: "14px",
                marginBottom: "6px",
              }}
            >
              <strong>{item.prompt}</strong>
              {item.style && (
                <span style={{ opacity: 0.7 }}> · {item.style}</span>
              )}
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
                maxHeight: "75vh",
                objectFit: "contain",
                borderRadius: "12px",
                display: "block",
                background: "#000",
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
