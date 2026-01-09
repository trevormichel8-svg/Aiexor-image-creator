"use client";

import Image from "next/image";
import { useState } from "react";

type ImageRow = {
  id: string;
  image_url: string;
  prompt: string;
  style: string;
  aspect_ratio: string;
  quality: string;
};

type Props = {
  image: ImageRow;
  onRefresh: () => void;
  onRemix: (image: ImageRow) => void;
};

export default function ImageCard({ image, onRefresh, onRemix }: Props) {
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
    <div className="relative mb-4">
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
          🔁 Variations ×4
        </button>

        <button
          onClick={() => onRemix(image)}
          className="flex-1 rounded-md bg-neutral-900 py-1 text-sm"
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
