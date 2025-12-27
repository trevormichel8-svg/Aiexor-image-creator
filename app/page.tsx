"use client";

import { useEffect, useRef, useState } from "react";
import PromptBar from "@/components/PromptBar";

type GeneratedImage = {
  image: string;
  prompt: string;
};

export default function Home() {
  const [images, setImages] = useState<GeneratedImage[]>([]);
  const [loading, setLoading] = useState(false);

  // keep a ref so PromptBar adapter can return last image
  const imagesRef = useRef<GeneratedImage[]>([]);
  useEffect(() => {
    imagesRef.current = images;
  }, [images]);

  /**
   * ORIGINAL generator
   * DO NOT change API contract
   */
  async function generate(prompt: string, _style: string) {
    setLoading(true);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      const data = await res.json();

      if (!data?.image) throw new Error("No image returned");

      setImages((prev) => [
        {
          image: data.image,
          prompt,
        },
        ...prev,
      ]);
    } catch (err) {
      console.error("Generation failed", err);
    } finally {
      setLoading(false);
    }
  }

  /**
   * 🔑 ADAPTER REQUIRED BY PromptBar
   * PromptBar → compiledPrompt → image
   */
  async function generateFromCompiledPrompt(
    compiledPrompt: string
  ): Promise<string> {
    await generate(compiledPrompt, "");

    const latest = imagesRef.current[0];
    return latest?.image ?? "";
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
      <div style={{ padding: "16px" }}>
        {images.map((img, i) => (
          <div key={i} style={{ marginBottom: "24px" }}>
            <img
              src={img.image}
              alt={img.prompt}
              style={{
                width: "100%",
                borderRadius: "12px",
                display: "block",
              }}
            />
            <div
              style={{
                opacity: 0.7,
                fontSize: "14px",
                marginTop: "6px",
              }}
            >
              {img.prompt}
            </div>
          </div>
        ))}
      </div>

      {/* PROMPT BAR */}
      <PromptBar onGenerate={generateFromCompiledPrompt} loading={loading} />
    </main>
  );
}
