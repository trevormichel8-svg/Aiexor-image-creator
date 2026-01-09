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

const STYLES = [
  "none",
  "Photorealistic",
  "Anime",
  "Logo",
  "3D Render",
  "Cyberpunk",
  "Fantasy",
  "Minimal",
  "Pixel Art",
];

const RATIOS = ["1:1", "4:5", "9:16", "16:9"];
const QUALITIES = [
  { key: "fast", label: "Fast", cost: 1 },
  { key: "standard", label: "Standard", cost: 2 },
  { key: "ultra", label: "Ultra", cost: 4 },
];

export default function Page() {
  const [prompt, setPrompt] = useState("");
  const [placeholder, setPlaceholder] = useState(PROMPT_EXAMPLES[0]);
  const [style, setStyle] = useState("none");
  const [aspectRatio, setAspectRatio] = useState("1:1");
  const [quality, setQuality] = useState("standard");
  const [loading, setLoading] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);

  // 🔹 Replace with your real credit state
  const credits = 3;
  const isLowCredits = credits <= 2;

  /* ---------------- PROMPT MEMORY ---------------- */
  useEffect(() => {
    const saved = localStorage.getItem("aiexor_state");
    if (saved) {
      const s = JSON.parse(saved);
      setPrompt(s.prompt || "");
      setStyle(s.style || "none");
      setAspectRatio(s.aspectRatio || "1:1");
      setQuality(s.quality || "standard");
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(
      "aiexor_state",
      JSON.stringify({ prompt, style, aspectRatio, quality })
    );
  }, [prompt, style, aspectRatio, quality]);

  /* ---------------- ROTATING PLACEHOLDER ---------------- */
  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholder(
        PROMPT_EXAMPLES[Math.floor(Math.random() * PROMPT_EXAMPLES.length)]
      );
    }, 3500);
    return () => clearInterval(interval);
  }, []);

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

  function surpriseMe() {
    setPrompt(
      PROMPT_EXAMPLES[Math.floor(Math.random() * PROMPT_EXAMPLES.length)]
    );
    setStyle(STYLES[Math.floor(Math.random() * STYLES.length)]);
    setAspectRatio(RATIOS[Math.floor(Math.random() * RATIOS.length)]);
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
              : "bg-neutral-800"
          }`}
        >
          ✨ {credits} credits
        </div>
      </div>

      {/* Prompt Bar */}
      <div className="sticky top-[52px] z-10 bg-black p-4 flex gap-2">
        <button
          onClick={() => setSheetOpen(true)}
          className="w-10 rounded-md bg-neutral-800 text-lg"
        >
          +
        </button>

        <div className="flex-1">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder={placeholder}
            className="w-full resize-none rounded-md bg-neutral-900 p-3 text-sm outline-none"
            rows={2}
          />

          <button
            onClick={generateImage}
            disabled={loading || !prompt}
            className={`mt-2 w-full rounded-md py-2 text-sm ${
              loading || !prompt
                ? "bg-neutral-700 opacity-50"
                : "bg-neutral-800 hover:bg-neutral-700"
            }`}
          >
            {loading ? "Generating…" : "Generate"}
          </button>
        </div>
      </div>

      {/* Gallery */}
      <section className="flex-1 px-4 pb-24">
        <Gallery
          onRemix={(img) => {
            setPrompt(img.prompt);
            setStyle(img.style);
            setAspectRatio(img.aspect_ratio);
            setQuality(img.quality);
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
        />
      </section>

      {/* Bottom Sheet */}
      {sheetOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60"
          onClick={() => setSheetOpen(false)}
        >
          <div
            className="absolute bottom-0 w-full rounded-t-2xl bg-neutral-900 p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 text-sm font-semibold opacity-70">
              Settings
            </div>

            {/* Styles */}
            <div className="mb-3">
              <div className="text-xs opacity-50 mb-1">Style</div>
              <div className="flex gap-2 overflow-x-auto">
                {STYLES.map((s) => (
                  <button
                    key={s}
                    onClick={() => setStyle(s)}
                    className={`px-3 py-1 rounded-full text-xs ${
                      style === s
                        ? "bg-white text-black"
                        : "bg-neutral-800"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Ratios */}
            <div className="mb-3">
              <div className="text-xs opacity-50 mb-1">Aspect Ratio</div>
              <div className="flex gap-2">
                {RATIOS.map((r) => (
                  <button
                    key={r}
                    onClick={() => setAspectRatio(r)}
                    className={`px-3 py-1 rounded-full text-xs ${
                      aspectRatio === r
                        ? "bg-white text-black"
                        : "bg-neutral-800"
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>

            {/* Quality */}
            <div className="mb-4">
              <div className="text-xs opacity-50 mb-1">Quality</div>
              <div className="flex gap-2">
                {QUALITIES.map((q) => (
                  <button
                    key={q.key}
                    onClick={() => setQuality(q.key)}
                    disabled={credits < q.cost}
                    className={`px-3 py-1 rounded-full text-xs ${
                      quality === q.key
                        ? "bg-white text-black"
                        : "bg-neutral-800"
                    } ${credits < q.cost ? "opacity-40" : ""}`}
                  >
                    {q.label} ({q.cost})
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={surpriseMe}
              className="w-full rounded-md bg-neutral-800 py-2 text-sm"
            >
              🎲 Surprise Me
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
