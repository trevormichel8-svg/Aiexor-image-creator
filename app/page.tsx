"use client";

import { useState } from "react";

const ART_STYLES = [
  "Photorealistic","Ultra Realistic","Cinematic","HDR","Studio Lighting",
  "Portrait Photography","Macro Photography","Long Exposure","Bokeh",
  "Film Grain","Analog Photo","Polaroid","Infrared","Night Photography",

  "Digital Art","Concept Art","Matte Painting","Environment Art",
  "Character Design","Game Art","Splash Art","Key Art","Illustration",

  "Anime","Manga","Chibi","Studio Ghibli Style","Kawaii","Mecha",
  "Cyberpunk Anime","Dark Anime","Isekai Style",

  "Cyberpunk","Steampunk","Dieselpunk","Biopunk","Retrofuturism",
  "Futuristic Sci-Fi","Space Art","Galaxy Scene","Nebula","Alien World",

  "Fantasy","Dark Fantasy","High Fantasy","Epic Fantasy","Mythology",
  "Medieval Fantasy","Dungeons and Dragons","Magic Realism",

  "Oil Painting","Watercolor","Acrylic Painting","Ink Drawing",
  "Charcoal Sketch","Pencil Drawing","Pastel Drawing","Ink Wash",

  "Impressionism","Expressionism","Abstract","Abstract Expressionism",
  "Surrealism","Cubism","Pop Art","Minimalism","Modern Art",
  "Art Nouveau","Art Deco","Baroque","Renaissance","Ukiyo-e",

  "Pixel Art","8-bit","16-bit","Retro Game Art","Isometric",
  "Low Poly","Voxel Art","Wireframe","Blueprint",

  "3D Render","Hyperreal 3D","Octane Render","Unreal Engine",
  "Blender Render","ZBrush Sculpt","Clay Render",

  "Graffiti","Street Art","Stencil Art","Mural Style",
  "Neon Glow","Vaporwave","Synthwave","Glitch Art",

  "Collage","Digital Collage","Photo Manipulation","Photobashing",
  "Mixed Media","Experimental AI","Neural Dream"
];

export default function Page() {
  const [prompt, setPrompt] = useState("");
  const [style, setStyle] = useState("Photorealistic");
  const [showStyles, setShowStyles] = useState(false);
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState<string[]>([]);

  async function generate() {
    if (!prompt || loading) return;
    setLoading(true);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: `${prompt}, ${style} style`
        }),
      });

      const data = await res.json();
      if (data.image) {
        setImages([data.image, ...images]);
      }
    } catch (e) {
      console.error(e);
    }

    setLoading(false);
  }

  return (
    <main className="min-h-screen relative pb-40">
      {/* IMAGE CANVAS */}
      <div className="flex flex-col items-center gap-8 pt-24">
        {images.length === 0 && (
          <p className="text-gray-500">
            Your generated images will appear here
          </p>
        )}

        {images.map((img, i) => (
          <img
            key={i}
            src={img}
            className="max-w-[90vw] rounded-2xl shadow-2xl"
            alt="Generated"
          />
        ))}
      </div>

      {/* BOTTOM INPUT BAR */}
      <div className="fixed bottom-0 left-0 right-0 bg-black/90 backdrop-blur border-t border-red-700 p-4">
        <div className="max-w-3xl mx-auto flex items-center gap-3">
          {/* STYLE BUTTON */}
          <button
            onClick={() => setShowStyles(!showStyles)}
            className="w-10 h-10 rounded-full border border-red-600 text-red-500 text-xl"
          >
            +
          </button>

          {/* PROMPT INPUT */}
          <input
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe the image you want to create…"
            className="flex-1 bg-zinc-900 text-white px-4 py-3 rounded-xl border border-red-700 focus:outline-none"
          />

          {/* GENERATE BUTTON */}
          <button
            onClick={generate}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-red-700 to-red-500 text-black font-semibold"
          >
            {loading ? "Generating…" : "Generate"}
          </button>
        </div>

        {/* STYLE MENU */}
        {showStyles && (
          <div className="mt-4 max-h-72 overflow-y-auto grid grid-cols-2 sm:grid-cols-3 gap-2 bg-black border border-red-700 rounded-xl p-3">
            {ART_STYLES.map((s) => (
              <button
                key={s}
                onClick={() => {
                  setStyle(s);
                  setShowStyles(false);
                }}
                className="text-left px-3 py-2 rounded hover:bg-red-600 hover:text-black"
              >
                {s}
              </button>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
