"use client";

import { useState } from "react";
import PromptBar from "@/components/PromptBar";

type GeneratedImage = {
  id: string;
  url: string;
  prompt: string;
  style: string;
  strength: number;
};

const ART_STYLES = [
  "Default",
  "Photorealistic",
  "Ultra Realistic",
  "Cinematic",
  "HDR",
  "Studio Lighting",
  "Portrait Photography",
  "Macro Photography",
  "Long Exposure",
  "Bokeh",
  "Film Grain",
  "Analog Photo",
  "Polaroid",
  "Infrared",
  "Night Photography",
  "Digital Art",
  "Concept Art",
  "Matte Painting",
  "Environment Art",
  "Character Design",
  "Game Art",
  "Illustration",
  "Anime",
  "Chibi",
  "Manga",
  "Cyberpunk",
  "Steampunk",
  "Dieselpunk",
  "Biopunk",
  "Solarpunk",
  "Fantasy",
  "Dark Fantasy",
  "Epic Fantasy",
  "High Fantasy",
  "Mythology",
  "Sci-Fi",
  "Space Opera",
  "Retro Futurism",
  "Vaporwave",
  "Synthwave",
  "Oil Painting",
  "Acrylic Painting",
  "Watercolor",
  "Ink Drawing",
  "Charcoal Sketch",
  "Pencil Drawing",
  "Graphite Sketch",
  "Abstract",
  "Surrealism",
  "Minimalism",
  "Expressionism",
  "Impressionism",
  "Cubism",
  "Pop Art",
  "Pixel Art",
  "Isometric",
  "Low Poly",
  "Voxel Art",
  "3D Render",
  "Octane Render",
  "Unreal Engine",
  "Unity Engine",
  "Blender Render",
  "ZBrush Sculpt",
  "Clay Render",
  "Wireframe",
  "Blueprint",
  "Line Art",
  "Vector Art",
  "Flat Design",
  "UI Illustration",
  "Icon Design",
  "Sticker Style",
  "Tattoo Design",
  "Graffiti",
  "Street Art",
  "Album Cover",
  "Poster Design",
  "Concept Sketch",
  "Architectural Visualization",
  "Interior Design Render",
  "Product Render",
  "Fashion Illustration",
  "Editorial Illustration",
  "Children’s Book Illustration",
  "Comic Book Style",
];

export default function Page() {
  const [images, setImages] = useState<GeneratedImage[]>([]);
  const [loading, setLoading] = useState(false);

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [style, setStyle] = useState("Default");
  const [strength, setStrength] = useState(70);

  async function handleGenerate(prompt: string) {
    if (!prompt || loading) return;
    setLoading(true);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: `${prompt}. Art style: ${style}. Style strength: ${strength}%.`,
        }),
      });

      const data = await res.json();

      if (data?.image) {
        setImages((prev) => [
          {
            id: crypto.randomUUID(),
            url: `data:image/png;base64,${data.image}`,
            prompt,
            style,
            strength,
          },
          ...prev,
        ]);
      }
    } catch (err) {
      console.error("Generation error:", err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {/* Hamburger Button */}
      {!sidebarOpen && (
        <button
          className="sidebar-button"
          onClick={() => setSidebarOpen(true)}
          aria-label="Open settings"
        >
          ☰
        </button>
      )}

      {/* Overlay */}
      {sidebarOpen && (
        <div
          className="sidebar-overlay"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? "open" : ""}`}>
        <div className="sidebar-header">
          <strong>Settings</strong>
          <button onClick={() => setSidebarOpen(false)}>✕</button>
        </div>

        <div className="sidebar-content">
          <label>Art Style</label>
          <select
            className="style-select"
            value={style}
            onChange={(e) => setStyle(e.target.value)}
          >
            {ART_STYLES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>

          <label>Style Strength: {strength}%</label>
          <input
            type="range"
            min={0}
            max={100}
            value={strength}
            onChange={(e) => setStrength(Number(e.target.value))}
          />
        </div>
      </aside>

      {/* Canvas */}
      <main className="canvas">
        {images.length === 0 && (
          <div className="empty-state">Generate your first image</div>
        )}

        {images.map((img) => (
          <div key={img.id} className="message">
            <img src={img.url} className="generated-image" />
            <div className="caption">
              {img.prompt}
              <br />
              <span className="style">
                {img.style} · {img.strength}%
              </span>
            </div>
          </div>
        ))}
      </main>

      {/* Prompt Bar */}
      <PromptBar onGenerate={handleGenerate} loading={loading} />
    </>
  );
}
