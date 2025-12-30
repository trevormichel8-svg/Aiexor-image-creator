"use client";

import { useState } from "react";
import PromptBar from "@/components/PromptBar";
import Sidebar from "@/components/Sidebar";
import { ART_STYLES } from "@/components/ArtStyleSheet";

export default function Page() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [style, setStyle] = useState("Default");
  const [strength, setStrength] = useState(70);
  const [loading, setLoading] = useState(false);

  async function handleGenerate(
    prompt: string,
    artStyle: string,
    styleStrength: number
  ) {
    setLoading(true);
    try {
      await fetch("/api/generate", {
        method: "POST",
        body: JSON.stringify({
          prompt,
          style: artStyle,
          strength: styleStrength,
        }),
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {/* Sidebar button */}
      {!sidebarOpen && (
        <button
          className="sidebar-button"
          onClick={() => setSidebarOpen(true)}
        >
          ☰
        </button>
      )}

      {/* Sidebar */}
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)}>
        <div className="sidebar-content">
          <label>Art Style</label>
          <select
            className="art-style-select"
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
      </Sidebar>

      {/* Canvas */}
      <main className="canvas">
        <div className="empty-state">Create your first image</div>
      </main>

      {/* Prompt bar */}
      <PromptBar
        loading={loading}
        onGenerate={(prompt) =>
          handleGenerate(prompt, style, strength)
        }
      />
    </>
  );
}
