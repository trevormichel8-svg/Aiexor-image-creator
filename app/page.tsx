"use client";

import { useState } from "react";
import PromptBar from "@/components/PromptBar";
import { compilePrompt } from "@/lib/promptCompiler";

type ImageItem = {
  id: string;
  url: string;
  prompt: string;
};

export default function Page() {
  const [images, setImages] = useState<ImageItem[]>([]);
  const [loading, setLoading] = useState(false);

  async function handleGenerate(
    prompt: string,
    style: string,
    strength: number
  ) {
    setLoading(true);

    const compiledPrompt = compilePrompt(prompt, style, strength);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: compiledPrompt }),
      });

      const data = await res.json();

      if (!data?.image) return;

      setImages((prev) => [
        {
          id: crypto.randomUUID(),
          url: data.image,
          prompt: compiledPrompt,
        },
        ...prev,
      ]);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-black text-white relative pb-32">
      {/* Image history / canvas */}
      <div className="flex flex-col gap-6 p-4 max-w-3xl mx-auto">
        {images.map((img) => (
          <div
            key={img.id}
            className="rounded-xl overflow-hidden border border-red-600/40 shadow-[0_0_20px_rgba(220,38,38,0.6)]"
          >
            <img
              src={img.url}
              alt={img.prompt}
              className="w-full h-auto"
            />
          </div>
        ))}
      </div>

      {/* Bottom prompt bar */}
      <PromptBar onGenerate={handleGenerate} loading={loading} />
    </main>
  );
}
