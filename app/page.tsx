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

/* 🎨 FULL ART STYLE CATALOG */
const STYLES = [
  "Default",

  // Illustration & Art
  "Digital Art",
  "Concept Art",
  "Matte Painting",
  "Oil Painting",
  "Watercolor",
  "Ink Illustration",
  "Charcoal Sketch",
  "Pastel Drawing",
  "Acrylic Painting",

  // Anime & Cartoon
  "Anime",
  "Dark Anime",
  "Chibi",
  "Manga",
  "Studio Ghibli",
  "Cartoon",
  "Pixar Style",
  "Disney Style",

  // Realism
  "Photorealistic",
  "Hyperrealistic",
  "Cinematic",
  "Ultra HD",
  "8K Photography",
  "Portrait Photography",
  "Studio Lighting",

  // Sci-Fi & Fantasy
  "Cyberpunk",
  "Steampunk",
  "Dieselpunk",
  "Sci-Fi Concept",
  "Fantasy Art",
  "Dark Fantasy",
  "Mythology",
  "Epic Fantasy",

  // Stylized / Abstract
  "Isometric",
  "Low Poly",
  "Voxel Art",
  "Abstract",
  "Surrealism",
  "Psychedelic",
  "Nebula",
  "Cosmic",
  "Fractal Art",

  // Games & 3D
  "3D Render",
  "Unreal Engine",
  "Unity Style",
  "Game Asset",
  "Game Concept Art",

  // Retro / Vintage
  "Retro",
  "Synthwave",
  "Vaporwave",
  "80s Neon",
  "90s Anime",
  "Vintage Poster",
  "Film Grain",

  // Design & UI
  "Minimalist",
  "Flat Design",
  "UI Illustration",
  "Vector Art",
  "Logo Style",

  // Special
  "AI Dream",
  "Glitch Art",
  "Experimental",
];

export default function Page() {
  const [images, setImages] = useState<GeneratedImage[]>([]);
  const [loading, setLoading] = useState(false);

  const [style, setStyle] = useState("Default");
  const [strength, setStrength] = useState(70);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // ✅ PromptBar-safe single argument
  async function handleGenerate(compiledPrompt: string) {
    try {
      setLoading(true);

      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: compiledPrompt,
          style,
          strength,
        }),
      });

      const data = await res.json();
      if (!data?.image) return;

      setImages((prev) => [
        {
          id: crypto.randomUUID(),
          url: `data:image/png;base64,${data.image}`,
          prompt: compiledPrompt,
          style,
          strength,
        },
        ...prev,
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {/* SIDEBAR BUTTON */}
      <button
        className="sidebar-button"
        onClick={() => setSidebarOpen(true)}
        aria-label="Open sidebar"
      >
        ☰
      </button>

      {/* SIDEBAR OVERLAY */}
      {sidebarOpen && (
        <div
          className="sidebar-overlay"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <aside className={`sidebar ${sidebarOpen ? "open" : ""}`}>
        <div className="sidebar-header">
          <strong>History</strong>
          <button onClick={() => setSidebarOpen(false)}>✕</button>
        </div>

        <div className="sidebar-content">
          {images.length === 0 && (
            <div style={{ padding: 12, opacity: 0.5 }}>
              No images yet
            </div>
          )}

          {images.map((img) => (
            <button key={img.id} className="sidebar-item">
              <img src={img.url} alt="" />
              <div>
                <div style={{ fontSize: 13 }}>{img.style}</div>
                <div style={{ fontSize: 11, opacity: 0.6 }}>
                  Strength {img.strength}%
                </div>
              </div>
            </button>
          ))}
        </div>

        <div className="sidebar-footer">
          <button className="danger" onClick={() => setImages([])}>
            Clear history
          </button>
        </div>
      </aside>

      {/* MAIN CANVAS */}
      <main className="canvas">
        {images.length === 0 && (
          <div className="empty-state">Generate your first image</div>
        )}

        {images.map((img) => (
          <div key={img.id} className="message">
            <img
              src={img.url}
              className="generated-image"
              alt={img.prompt}
            />
            <div className="caption">
              <span className="style">{img.style}</span> · {img.strength}%
            </div>
          </div>
        ))}
      </main>

      {/* STYLE + STRENGTH CONTROLS */}
      <div
        style={{
          position: "fixed",
          right: 12,
          top: "50%",
          transform: "translateY(-50%)",
          display: "flex",
          flexDirection: "column",
          gap: 12,
          zIndex: 60,
        }}
      >
        <select
          value={style}
          onChange={(e) => setStyle(e.target.value)}
          style={{ padding: 6 }}
        >
          {STYLES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>

        <input
          type="range"
          min={0}
          max={100}
          value={strength}
          onChange={(e) => setStrength(Number(e.target.value))}
        />
      </div>

      {/* PROMPT BAR */}
      <PromptBar onGenerate={handleGenerate} loading={loading} />
    </>
  );
}
