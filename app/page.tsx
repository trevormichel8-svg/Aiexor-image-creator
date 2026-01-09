"use client";

import { useState } from "react";
import Gallery from "@/components/Gallery";

type RemixImage = {
  prompt: string;
  style: string;
  aspect_ratio: string;
  quality: string;
};

export default function Page() {
  const [prompt, setPrompt] = useState("");
  const [style, setStyle] = useState("none");
  const [aspectRatio, setAspectRatio] = useState("1:1");
  const [quality, setQuality] = useState("standard");
  const [loading, setLoading] = useState(false);

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
      {/* Prompt Bar */}
      <div className="sticky top-0 z-10 bg-black p-4">
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Describe the image you want to generate…"
          className="w-full resize-none rounded-md bg-neutral-900 p-3 text-sm outline-none"
          rows={3}
        />

        <button
          onClick={generateImage}
          disabled={loading}
          className="mt-2 w-full rounded-md bg-neutral-800 py-2 text-sm"
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
