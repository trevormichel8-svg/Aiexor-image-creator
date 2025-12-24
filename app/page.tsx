"use client";

import { useState } from "react";

type GeneratedImage = {
  id: string;
  url: string;
  prompt: string;
  style: string;
};

const ART_STYLES = [
  "Photorealistic",
  "Cinematic",
  "Oil Painting",
  "Watercolor",
  "Charcoal Sketch",
  "Pencil Drawing",
  "Digital Painting",
  "Pixel Art",
  "Low Poly",
  "Line Art",
  "Anime",
  "Manga",
  "Cyberpunk",
  "Steampunk",
  "Sci-Fi",
  "Fantasy",
  "Concept Art",
  "Abstract",
  "Minimalist",
  "Surreal",
  "Pop Art",
  "Ukiyo-e",
  "Baroque",
  "Renaissance",
  "Noir",
  "Vaporwave",
  "Synthwave",
  "Dark Fantasy",
  "Isometric",
  "Vector Art",
  "Matte Painting",
  "Graffiti",
  "Neon Glow",
  "Infrared",
  "Long Exposure",
  "Macro",
  "Cinematic Lighting",
  "Film Grain",
  "HDR",
  "Dreamlike",
  "Lofi",
  "Nature",
  "Space Art",
  "Galaxy",
  "Fractal",
  "Neural",
  "Blueprint",
  "Retro Futurism",
  "Comic Book",
  "Kawaii",
  "Geometric",
  "Mixed Media",
  "Mosaic",
  "Stained Glass",
  "8-bit",
  "16-bit",
  "Claymation",
  "Stop Motion",
  "Paper Cut",
  "Glitch",
  "Ink Wash",
  "Pastel",
  "Expressionism",
  "Realism",
  "Hyperrealism",
  "Ultra Detailed",
  "Studio Portrait",
  "Cinematic Portrait",
  "Wide Angle",
  "Soft Focus",
  "High Contrast",
  "Moody Lighting",
  "Epic Scale",
  "Cosmic Horror",
  "Astral",
  "Celestial",
  "Deep Space",
  "Alien World",
  "NASA Style",
  "Sci-Fi Concept",
];

export default function HomePage() {
  const [prompt, setPrompt] = useState("");
  const [style, setStyle] = useState(ART_STYLES[0]);
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState<GeneratedImage[]>([]);

  async function handleGenerate() {
    if (!prompt.trim() || loading) return;

    setLoading(true);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt,
          style,
        }),
      });

      const data = await res.json();

      if (data?.url) {
        setImages((prev) => [
          {
            id: crypto.randomUUID(),
            url: data.url,
            prompt,
            style,
          },
          ...prev,
        ]);
      }
    } catch (err) {
      console.error("Generation failed", err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="relative flex min-h-screen flex-col items-center px-4 pb-36">
      {/* Image Feed */}
      <div className="w-full max-w-3xl pt-10 space-y-10">
        {images.map((img) => (
          <div key={img.id} className="fade-in">
            <p className="mb-2 text-sm text-gray-400">
              {img.prompt} — <span className="italic">{img.style}</span>
            </p>
            <img
              src={img.url}
              alt={img.prompt}
              className="w-full rounded-xl shadow-2xl"
            />
          </div>
        ))}
      </div>

      {/* Prompt Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-black/80 backdrop-blur border-t border-neutral-800">
        <div className="mx-auto flex max-w-3xl flex-col gap-3 px-4 py-4">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe the image you want to create…"
            rows={2}
            className="w-full resize-none rounded-lg bg-neutral-900 px-4 py-3 text-white outline-none chrome-red"
          />

          <div className="flex flex-col gap-3 sm:flex-row">
            <select
              value={style}
              onChange={(e) => setStyle(e.target.value)}
              className="flex-1 rounded-lg bg-neutral-900 px-3 py-2 text-white chrome-red"
            >
              {ART_STYLES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>

            <button
              onClick={handleGenerate}
              disabled={loading}
              className="rounded-lg px-6 py-2 font-semibold text-black chrome-red-glow disabled:opacity-50"
            >
              {loading ? "Generating…" : "Generate"}
            </button>
          </div>

          <p className="text-xs text-gray-500 text-center">
            Images generated using OpenAI
          </p>
        </div>
      </div>
    </main>
  );
}
