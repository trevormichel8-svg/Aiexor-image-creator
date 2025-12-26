"use client";

import { useState } from "react";
import PromptBar from "@/components/PromptBar";

export default function Page() {
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function generate(prompt: string) {
    if (!prompt) return;

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Generation failed");
      }

      const imageUrl = `data:image/png;base64,${data.image}`;
      setImages((prev) => [...prev, imageUrl]);
    } catch (err: any) {
      setError("Image generation failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-black text-white pb-24">
      <div className="p-4 space-y-6">
        {images.map((src, i) => (
          <img
            key={i}
            src={src}
            alt="Generated"
            className="w-full rounded"
          />
        ))}

        {error && <p className="text-red-500">{error}</p>}
      </div>

      <PromptBar onGenerate={generate} loading={loading} />
    </main>
  );
}
