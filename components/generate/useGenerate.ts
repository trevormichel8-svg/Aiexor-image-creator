"use client";

import { useState } from "react";

export function useGenerate() {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function generate(prompt: string) {
    if (!prompt.trim()) {
      setError("Prompt is empty");
      return;
    }

    setLoading(true);
    setError(null);
    setImageUrl(null);

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

      setImageUrl(data.imageUrl);
    } catch (err: any) {
      console.error("GENERATION ERROR:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return {
    generate,
    imageUrl,
    loading,
    error,
  };
}
