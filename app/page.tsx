"use client";

import { useState } from "react";
import PromptBar from "@/components/PromptBar";
import Sidebar from "@/components/Sidebar";

export default function Page() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <>
      {/* Sidebar toggle button */}
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
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="canvas">
        <div className="empty-state">Create your first image</div>
      </main>

      <PromptBar />
    </>
  );
}
