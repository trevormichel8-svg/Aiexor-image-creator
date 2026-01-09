"use client";

import { useEffect, useState } from "react";
import Gallery from "@/components/Gallery";

const PROMPT_EXAMPLES = [
  "Cyberpunk city at night, neon lights, rain",
  "Luxury black and gold logo for an AI brand",
  "Photorealistic portrait, cinematic lighting",
  "Futuristic sports car, studio lighting",
  "Minimal abstract art, modern color palette",
];

type RemixImage = {
  prompt: string;
  style: string;
  aspect_ratio: string;
  quality: string;
};

export default function Page() {
  const [prompt, setPrompt] = useState("");
  const [placeholder, setPlaceholder] = useState(PROMPT_EXAMPLES[0]);
  const [style, setStyle] = useState("none");
  const [aspectRatio, setAspectRatio] = useState("1:1");
  const [quality, setQuality] = useState("standard");
  const [loading, setLoading] = useState(false);

  // MOCK credits – replace with your real credit state
  const credits = 3;
  const isLowCredits = credits <= 2;

  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholder(
        PROMPT_EXAMPLES[Math.floor(Math.random() * PROMPT_EXAMPLES.length)]
      );
    }, 3500);

    return () => clearInterval(interval);
  }, []);

  function handleRemix(image: RemixImage) {
    setPrompt(image.prompt);
    setStyle(image.style);
    setAspectRatio(image.aspect_ratio);
    setQuality(image.quality);

    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function generateImage() {
    if (!prompt) return;

    setLoading(true);

    await fetch("/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        prompt,
        style,
        aspect_ratio: aspectRatio,
        quality,
        mode: "generate",
      }),
    });

    setLoading(false);
  }

  return (
    <main className="flex min-h-screen flex-col bg-black text-white">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-black p-4 flex items-center justify-between">
        <span className="font-semibold">Aiexor</span>

        <div
          className={`text-xs px-3 py-1 rounded-full ${
            isLowCredits
              ? "bg-red-600 text-white animate-pulse"
              : "bg-neutral-800 text-white"
          }`}
        >
          ✨ {credits} credits
        </div>
      </div>

      {/* Prompt Bar */}
      <div className="sticky top-[52px] z-10 bg-black p-4">
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder={placeholder}
          className="w-full resize-none rounded-md bg-neutral-900 p-3 text-sm outline-none"
          rows={3}
        />

        <button
          onClick={generateImage}
          disabled={loading || !prompt}
          className={`mt-2 w-full rounded-md py-2 text-sm transition ${
            loading || !prompt
              ? "bg-neutral-700 opacity-50"
              : "bg-neutral-800 hover:bg-neutral-700"
          }`}
        >
          {loading ? "Generating…" : "Generate"}
        </button>
      </div>

      {/* Gallery */}
      <section className="flex-1 px-4 pb-24">
        <Gallery onRemix={handleRemix} />
      </section>
    </main>
  );
}
