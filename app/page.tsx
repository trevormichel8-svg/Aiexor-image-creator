"use client";

import { useState } from "react";

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [style, setStyle] = useState("Luxury Gold");
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function generate() {
    setLoading(true);
    setImage(null);

    const res = await fetch("/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt, style }),
    });

    const data = await res.json();
    setImage(data.image);
    setLoading(false);
  }

  return (
    <main className="container">
      <h1>AI Image Studio</h1>

      <textarea
        placeholder="Describe your image..."
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
      />

      <select value={style} onChange={(e) => setStyle(e.target.value)}>
        <option>Luxury Gold</option>
        <option>Cyber Neon</option>
        <option>Minimal Tech</option>
        <option>Dark Fantasy</option>
      </select>

      <button onClick={generate} disabled={loading}>
        {loading ? "Generating..." : "Generate Image"}
      </button>

      {image && <img src={image} alt="Generated" />}
    </main>
  );
      }
