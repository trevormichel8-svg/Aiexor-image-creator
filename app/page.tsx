"use client";

import { useState } from "react";
import Starfield from "@/components/Starfield";
import PromptBar from "@/components/PromptBar";
import ImageCanvas from "@/components/ImageCanvas";

export default function Page() {
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  async function generate(prompt: string, style: string) {
    if (!prompt || loading) return;

    setLoading(true);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, style }),
      });

      const data = await res.json();

      if (data?.image) {
        setImages((prev) => [...prev, data.image]);
      }
    } catch (err) {
      console.error("Generation failed", err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="relative min-h-screen overflow-hidden">
      {/* Animated space background */}
      <Starfield />

      {/* Scrollable image history */}
      <ImageCanvas images={images} />

      {/* Bottom prompt bar */}
      <PromptBar onGenerate={generate} loading={loading} />
    </main>
  );
}
