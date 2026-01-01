"use client";

import { useState } from "react";
import PromptBar from "@/components/PromptBar";
import Sidebar from "@/components/Sidebar";

export default function Page() {
  const [loading, setLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  async function handleGenerate(prompt: string) {
    if (!prompt.trim()) return;

    try {
      setLoading(true);

      await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {/* Sidebar */}
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main content */}
      <main className="canvas">
        <h1>Create your first image</h1>
      </main>

      {/* Prompt Bar — REQUIRED PROPS */}
      <PromptBar loading={loading} onGenerate={handleGenerate} />
    </>
  );
}
