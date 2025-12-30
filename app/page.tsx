"use client";

import { useState } from "react";
import PromptBar from "@/components/PromptBar";
import SidebarButton from "@/components/SidebarButton";

/* Optional sidebar stub (safe even if you replace later) */
function Sidebar({ onClose }: { onClose: () => void }) {
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        height: "100vh",
        width: "280px",
        background: "#0b0b0b",
        zIndex: 2147483646,
        boxShadow: "4px 0 30px rgba(255,0,0,0.35)",
        padding: "16px",
      }}
    >
      <button
        onClick={onClose}
        style={{
          background: "none",
          border: "none",
          color: "#fff",
          fontSize: "20px",
          marginBottom: "20px",
        }}
      >
        ✕ Close
      </button>

      <div style={{ color: "#aaa" }}>
        <p>History</p>
        <p>Styles</p>
        <p>Settings</p>
      </div>
    </div>
  );
}

export default function Page() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  /* Example generate handler (keep or replace with yours) */
  const handleGenerate = async (
    prompt: string,
    style: string,
    strength: number
  ) => {
    setLoading(true);
    try {
      // your existing generate logic
      console.log({ prompt, style, strength });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* 🔴 STEP 2: SIDEBAR BUTTON MUST LIVE HERE */}
      <SidebarButton onClick={() => setSidebarOpen(true)} />

      {/* Sidebar */}
      {sidebarOpen && <Sidebar onClose={() => setSidebarOpen(false)} />}

      {/* Main app content */}
      <main
        style={{
          minHeight: "100vh",
          background: "black",
          paddingBottom: "120px",
        }}
      >
        {/* Image canvas / history goes here */}

        {/* Prompt bar */}
        <PromptBar onGenerate={handleGenerate} loading={loading} />
      </main>
    </>
  );
}
