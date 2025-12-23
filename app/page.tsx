"use client";

import { useState } from "react";

const styles = [
  "None",
  "Photorealistic",
  "Oil Painting",
  "Watercolor",
  "Charcoal Sketch",
  "Pencil Drawing",
  "Digital Painting",
  "Pixel Art",
  "Low Poly 3D",
  "Line Art",
  "Cartoon",
  "Anime",
  "Manga Ink",
  "Cyberpunk",
  "Steampunk",
  "Futuristic Sci-Fi",
  "Fantasy Illustration",
  "Concept Art",
  "Abstract Expressionism",
  "Impressionism",
  "Minimalism",
  "Pop Art",
  "Cubism",
  "Surrealism",
  "Vector Art",
  "Isometric",
  "Flat Design",
  "Matte Painting",
  "Graffiti",
  "Street Art",
  "3D Render",
  "Glitchcore",
  "Vaporwave",
  "Synthwave",
  "Dark Fantasy",
  "Baroque",
  "Renaissance",
  "Ukiyo-e",
  "Art Nouveau",
  "Art Deco",
  "Retro Futurism",
  "Chiaroscuro",
  "Ink Wash",
  "Pastel Drawing",
  "Realism",
  "Expressionism",
  "Psychedelic",
  "Comic Book",
  "Noir",
  "Digital Collage",
  "Photo Collage",
  "Claymation",
  "Stop Motion",
  "Paper Cut",
  "Neon Glow",
  "Infrared",
  "Long Exposure",
  "Macro Photography",
  "Cinematic Lighting",
  "Studio Portrait",
  "Film Grain",
  "Bokeh",
  "HDR",
  "Lofi Aesthetic",
  "Dreamcore",
  "Cottagecore",
  "Nature Photography",
  "Wildlife Art",
  "Landscape Painting",
  "Seascape",
  "Space Art",
  "Galaxy Scene",
  "AI-Generated Abstract",
  "Brush Stroke",
  "Ink Pen",
  "Stencil",
  "Graffiti Marker",
  "Mixed Media",
  "Mosaic",
  "Stained Glass",
  "Embroidery",
  "Pixel Mosaic",
  "Wireframe",
  "Blueprint",
  "Digital Wireframe",
  "Retro Game",
  "8-bit Art",
  "16-bit Art",
  "Comic Pop",
  "Kawaii",
  "Linework Tattoo",
  "Geometric Pattern",
  "Fractal Design",
  "Neural Dream",
  "AR/VR Hologram",
  "Photobash",
  "Real-Time Render",
  "Motion Blur",
  "AI Glow",
];

export default function HomePage() {
  const [prompt, setPrompt] = useState("");
  const [style, setStyle] = useState(styles[0]);

  return (
    <main className="min-h-screen flex flex-col items-center px-4 pt-24 pb-24">
      <section className="w-full max-w-[420px] text-center mb-20">
        <h1 className="text-[2.4rem] font-semibold leading-tight mb-8">
          <span className="block gold-text mb-1">Aiexor.com</span>
          <span className="block text-white">
            Let Your Imagination
          </span>
          <span className="block gold-text">Run Wild.</span>
        </h1>

        <p className="text-sm text-gray-400 mb-14 leading-relaxed">
          Turn your ideas into incredible AI art with Aiexor Image Creator
          powered by OpenAI.
          <br />
          Fast, easy, and limitless creativity at your fingertips.
        </p>

        <div className="glass glow-border rounded-2xl p-6">
          <h3 className="font-semibold mb-4 text-left">
            GPT-Image 1.5
          </h3>

          <div className="space-y-4">
            <input
              placeholder="Describe your image idea..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
            />

            <select
              value={style}
              onChange={(e) => setStyle(e.target.value)}
            >
              {styles.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>

            <button className="btn-gold w-full py-3">
              Generate Image
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
