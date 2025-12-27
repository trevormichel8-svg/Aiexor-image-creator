"use client";

import { useState } from "react";
import PromptBar from "@/components/PromptBar";

type ImageItem = {
  prompt: string;
  url: string;
};

export default function Page() {
  const [images, setImages] = useState<ImageItem[]>([]);
  const [loading, setLoading] = useState(false);

  async function generate(prompt: string, style: string) {
    try {
      setLoading(true);

      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: `${prompt}, ${style} style`,
        }),
      });

      const data = await res.json();

      if (!data?.image) {
        throw new Error("No image returned");
      }

      setImages((prev) => [
        ...prev,
        { prompt, url: data.image },
      ]);
    } catch (err) {
      console.error(err);
      alert("Image generation failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-black text-white pb-32">
      <div className="p-4 space-y-8">
        {images.map((img, i) => (
          <div
            key={i}
            className="max-w-xl mx-auto rounded-xl overflow-hidden border border-red-600/40 shadow-[0_0_20px_rgba(255,0,0,0.4)]"
          >
            <img src={img.url} alt={img.prompt} />
          </div>
        ))}
      </div>

      <PromptBar onGenerate={generate} loading={loading} />
    </main>
  );
}
