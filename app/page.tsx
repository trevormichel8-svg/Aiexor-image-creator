"use client";

import { useState } from "react";

export default function HomePage() {
  const [prompt, setPrompt] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  async function generateImage() {
    if (!prompt || loading) return;

    setLoading(true);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      const data = await res.json();

      if (data.image) {
        setImages((prev) => [data.image, ...prev]);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
      setPrompt("");
    }
  }

  return (
    <>
      <div className="starfield" />

      <main className="canvas">
        {loading && <div className="skeleton" />}

        {images.map((src, i) => (
          <div className="image-card" key={i}>
            <img src={src} alt="Generated" />
          </div>
        ))}
      </main>

      {/* PROMPT BAR */}
      <div className="prompt-bar-wrapper">
        <div className="prompt-bar">
          <input
            className="prompt-input"
            placeholder="Describe an image..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && generateImage()}
          />

          <button
            className="circle-btn"
            onClick={generateImage}
            disabled={loading}
            title="Generate"
          >
            ➤
          </button>
        </div>
      </div>
    </>
  );
}
