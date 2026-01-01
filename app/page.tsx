"use client";

import { useState } from "react";
import Sidebar from "../components/Sidebar";
import PromptBar from "../components/PromptBar";

export default function Page() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [artStyle, setArtStyle] = useState("Default");
  const [strength, setStrength] = useState(70);
  const [loading, setLoading] = useState(false);

  return (
    <>
      {/* SIDEBAR BUTTON */}
      <button
        className="sidebar-toggle"
        onClick={() => setSidebarOpen(true)}
      >
        ☰
      </button>

      <main className="canvas">
        <h1 className="hero-text">
          Create your first image
        </h1>
      </main>

      <PromptBar loading={loading} onGenerate={() => {}} />

      <Sidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        artStyle={artStyle}
        setArtStyle={setArtStyle}
        strength={strength}
        setStrength={setStrength}
      />
    </>
  );
}
