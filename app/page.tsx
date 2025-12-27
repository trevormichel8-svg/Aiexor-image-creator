// app/page.tsx
"use client";

import { useState } from "react";
import PromptBar from "@/components/PromptBar";

export default function Page() {
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  async function generate(prompt: string, style: string) {
    try {
      setLoading(true);

      const finalPrompt = style
        ? `${prompt}, ${style}`
        : prompt;

      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: finalPrompt }),
      });

      const data = await res.json();
      if (data.image) {
        setImages((prev) => [data.image, ...prev]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {/* SCROLLABLE CANVAS */}
      <main
        id="canvas"
        className="min-h-screen overflow-y-auto pb-32"
      >
        <div className="flex flex-col items-center gap-6 px-4 pt-6">
          {images.map((src, i) => (
            <img
              key={i}
              src={src}
              alt="Generated"
              className="max-w-full rounded-xl shadow-[0_0_25px_rgba(255,0,0,0.5)]"
            />
          ))}
        </div>
      </main>

      {/* FIXED PROMPT BAR */}
      <PromptBar
        onGenerate={generate}
        loading={loading}
      />
    </>
  );
}
