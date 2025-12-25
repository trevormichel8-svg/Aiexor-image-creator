"use client";

import { useState } from "react";
import Starfield from "@/components/Starfield";
import PromptBar from "@/components/PromptBar";
import ImageCanvas from "@/components/ImageCanvas";

export default function Page() {
  const [images, setImages] = useState<string[]>([]);

  function generate(prompt: string, style: string) {
    if (!prompt) return;

    // TEMP PLACEHOLDER IMAGE
    const img = `https://picsum.photos/seed/${encodeURIComponent(
      prompt + style
    )}/1024/1024`;

    setTimeout(() => {
      setImages((prev) => [...prev, img]);
    }, 1500);
  }

  return (
    <>
      <Starfield />
      <ImageCanvas images={images} />
      <PromptBar onGenerate={generate} />
    </>
  );
}
