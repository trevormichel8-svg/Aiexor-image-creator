"use client";

import { useState } from "react";
import PromptBar from "@/components/PromptBar";

/**
 * COMPLETE ART STYLE LIST
 * (safe strings only – no special characters that break prompts)
 */
const ART_STYLES = [
  "Default",
  "Anime",
  "Dark Anime",
  "Chibi",
  "Isometric",
  "Cyberpunk",
  "Fantasy",
  "High Fantasy",
  "Dark Fantasy",
  "Mythology",
  "Greek Mythology",
  "Norse Mythology",
  "Egyptian Mythology",
  "Nebula",
  "Cosmic",
  "Space Art",
  "Oil Painting",
  "Watercolor",
  "Ink Illustration",
  "Charcoal Sketch",
  "Concept Art",
  "Digital Painting",
  "Photorealistic",
  "Hyperrealistic",
  "Cinematic",
  "Studio Lighting",
  "Portrait Photography",
  "Pixel Art",
  "Voxel Art",
  "Low Poly",
  "3D Render",
  "Octane Render",
  "Unreal Engine",
  "Comic Book",
  "Manga",
  "Graphic Novel",
  "Line Art",
  "Minimalist",
  "Surreal",
  "Abstract",
  "Synthwave",
  "Vaporwave",
  "Retrofuturism",
  "Steampunk",
  "Gothic",
  "Baroque",
  "Renaissance",
  "Medieval",
  "Art Nouveau",
  "Pop Art",
  "Graffiti",
  "Street Art",
  "Ukiyo-e",
  "Traditional Chinese Painting",
  "Traditional Japanese Painting",
  "Fantasy Illustration",
  "Sci-Fi Illustration",
];

export default function Page() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [style, setStyle] = useState("Default");
  const [strength, setStrength] = useState(70);
  const [loading, setLoading] = useState(false);

  /**
   * IMPORTANT:
   * PromptBar expects: onGenerate(prompt: string)
   * We inject style + strength HERE
   */
  async function handleGenerate(prompt: string) {
    setLoading(true);

    try {
      await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt,
          style,
          strength,
        }),
      });
    } catch (err) {
      console.error("Generate failed:", err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {/* SIDEBAR TOGGLE */}
      <button
        className="sidebar-button"
        onClick={() => setSidebarOpen(true)}
        aria-label="Open settings"
      >
        ☰
      </button>

      {/* SIDEBAR */}
      {sidebarOpen && (
        <>
          <div
            className="sidebar-overlay"
            onClick={() => setSidebarOpen(false)}
          />

          <aside className="sidebar open">
            <div className="sidebar-header">
              <strong>Settings</strong>
              <button onClick={() => setSidebarOpen(false)}>✕</button>
            </div>

            <div className="sidebar-content">
              {/* ART STYLE */}
              <label className="sidebar-label">Art Style</label>
              <select
                className="sidebar-select"
                value={style}
                onChange={(e) => setStyle(e.target.value)}
              >
                {ART_STYLES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>

              {/* STYLE STRENGTH */}
              <label className="sidebar-label">
                Style Strength: {strength}%
              </label>
              <input
                className="sidebar-slider"
                type="range"
                min={0}
                max={100}
                value={strength}
                onChange={(e) => setStrength(Number(e.target.value))}
              />
            </div>
          </aside>
        </>
      )}

      {/* MAIN CANVAS */}
      <main className="canvas">
        <div className="empty-state">Generate your first image</div>
      </main>

      {/* PROMPT BAR (UNCHANGED API) */}
      <PromptBar onGenerate={handleGenerate} loading={loading} />
    </>
  );
}
