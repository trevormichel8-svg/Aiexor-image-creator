"use client";

import Image from "next/image";
import { useState } from "react";

type Props = {
  image: any;
  onRefresh: () => void;
};

export default function ImageCard({ image, onRefresh }: Props) {
  const [loading, setLoading] = useState(false);

  async function generateVariations() {
    setLoading(true);

    await fetch("/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        mode: "variation",
        prompt: image.prompt,
        style: image.style,
        aspect_ratio: image.aspect_ratio,
        quality: image.quality,
      }),
    });

    setLoading(false);
    onRefresh();
  }

  return (
    <div className="relative">
      <Image
        src={image.image_url}
        alt={image.prompt}
        width={512}
        height={512}
        className="rounded-lg"
      />

      <div className="flex gap-2 mt-2">
        <button
          disabled={loading}
          onClick={generateVariations}
          className="flex-1 rounded-md bg-neutral-800 py-1 text-sm"
        >
          🔁 Variations
        </button>

        <button
          disabled
          className="flex-1 rounded-md bg-neutral-900 py-1 text-sm opacity-50"
        >
          ✏️ Remix
        </button>
      </div>

      {loading && (
        <div className="absolute inset-0 bg-black/60 flex items-center justify-center rounded-lg">
          <span className="text-sm">Generating…</span>
        </div>
      )}
    </div>
  );
}
