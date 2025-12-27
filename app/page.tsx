"use client";

import { useState } from "react";
import PromptBar from "@/components/PromptBar";

export default function Page() {
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function generate(prompt: string, style: string) {
    setLoading(true);
    setError(null);
    setImage(null);

    try {
      // ✅ Merge style into prompt (CRITICAL)
      const fullPrompt = style
        ? `${prompt}, ${style} style`
        : prompt;

      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: fullPrompt }),
      });

      if (!res.ok) {
        throw new Error("Generation failed");
      }

      const data = await res.json();

      if (!data?.image) {
        throw new Error("No image returned");
      }

      // ✅ Store BASE64 only (not URL)
      setImage(data.image);
    } catch (err: any) {
      setError(err.message || "Image generation failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "black",
        paddingBottom: "120px", // space for prompt bar
      }}
    >
      {/* IMAGE CANVAS */}
      <div
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "center",
          paddingTop: "16px",
        }}
      >
        {loading && (
          <p style={{ color: "white", opacity: 0.7 }}>Generating…</p>
        )}

        {error && (
          <p style={{ color: "red", opacity: 0.8 }}>{error}</p>
        )}

        {image && (
          <img
            src={`data:image/png;base64,${image}`} // ✅ FIX
            alt="Generated"
            style={{
              maxWidth: "100%",
              height: "auto",
              borderRadius: "12px",
              boxShadow: "0 0 40px rgba(255,0,0,0.25)",
            }}
          />
        )}
      </div>

      {/* PROMPT BAR */}
      <PromptBar onGenerate={generate} loading={loading} />
    </main>
  );
}
