"use client";

export const dynamic = "force-dynamic";

import PromptInput from "@/components/generate/PromptInput";
import GenerateButton from "@/components/generate/GenerateButton";
import ImageResult from "@/components/generate/ImageResult";
import { useGenerate } from "@/components/generate/useGenerate";
import { useState } from "react";

export default function GeneratePage() {
  const [prompt, setPrompt] = useState("");
  const { generate, imageUrl, loading, error } = useGenerate();

  return (
    <div className="space-y-4">
      <PromptInput value={prompt} onChange={setPrompt} />

      <GenerateButton
        loading={loading}
        onGenerate={() => generate(prompt)}
      />

      {error && <p className="text-red-500">{error}</p>}

      <ImageResult imageUrl={imageUrl} />
    </div>
  );
}
