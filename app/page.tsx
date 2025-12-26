"use client";

import { useState } from "react";

export default function Page() {
  const [prompt, setPrompt] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function generate() {
    setLoading(true);
    setError("");
    setImage(null);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Generation failed");
      }

      setImage(`data:image/png;base64,${data.imageBase64}`);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center gap-4 p-4">
      <input
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Describe an image"
        className="w-full max-w-md p-3 rounded bg-neutral-800"
      />

      <button
        onClick={generate}
        disabled={loading}
        className="px-6 py-3 rounded bg-red-600"
      >
        {loading ? "Generating…" : "Generate"}
      </button>

      {error && <p className="text-red-500">{error}</p>}

      {image && (
        <img
          src={image}
          alt="Generated"
          className="mt-4 max-w-md rounded"
        />
      )}
    </main>
  );
}
