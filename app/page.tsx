"use client";

import { useState } from "react";
import PromptBar from "@/components/PromptBar";
import Sidebar from "@/components/Sidebar";

export default function HomePage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [styleStrength, setStyleStrength] = useState(70);

  return (
    <>
      {/* Sidebar button */}
      {!sidebarOpen && (
        <button
          className="sidebar-button"
          onClick={() => setSidebarOpen(true)}
          aria-label="Open settings"
        >
          ☰
        </button>
      )}

      {/* Sidebar */}
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)}>
        <h1 className="sidebar-title">Settings</h1>

        {/* Art style pill */}
        <button className="art-style-pill">
          Art Styles
        </button>

        {/* Spacing */}
        <div style={{ height: 32 }} />

        {/* Slider */}
        <div className="slider-block">
          <div className="slider-label">
            Style Strength: {styleStrength}%
          </div>

          <input
            type="range"
            min={0}
            max={100}
            value={styleStrength}
            onChange={(e) => setStyleStrength(Number(e.target.value))}
          />
        </div>
      </Sidebar>

      {/* Main content */}
      <main className="canvas">
        <div className="empty-state">
          <h2>Create your first image</h2>
        </div>
      </main>

      {/* Prompt bar */}
      <PromptBar
        loading={false}
        onGenerate={() => {}}
      />
    </>
  );
}
