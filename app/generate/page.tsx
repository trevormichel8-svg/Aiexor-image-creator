"use client";

export const dynamic = "force-dynamic";

import { useState } from "react";
import PromptInput from "@/components/generate/PromptInput";
import GenerateButton from "@/components/generate/GenerateButton";
import { useGenerate } from "@/components/generate/useGenerate";

export default function GeneratePage() {
  const [prompt, setPrompt] = useState("");
  const { generate, imageUrl, loading, error } = useGenerate();

  return (
    <div className="mx-auto w-full max-w-xl px-4 py-6 sm:max-w-2xl lg:max-w-4xl">
      <h1 className="mb-2 text-center text-2xl font-bold text-yellow-400">
        Let Your Imagination Run Wild
      </h1>

      <p className="mb-6 text-center text-sm text-gray-300">
        Images generated using OpenAI models
      </p>

      <div className="rounded-xl border border-yellow-500/30 bg-black/60 p-4 backdrop-blur">
        <PromptInput value={prompt} onChange={setPrompt} />

        <div className="mt-4">
          <GenerateButton
            loading={loading}
            onGenerate={() => generate(prompt)}
          />
        </div>
      </div>

      {loading && (
        <p className="mt-6 text-center text-yellow-400">
          Generating image…
        </p>
      )}

      {error && (
        <p className="mt-6 text-center text-red-500">
          {error}
        </p>
      )}

      {imageUrl && (
        <div className="mt-8 rounded-xl border border-yellow-500/30 p-4">
          <img
            src={imageUrl}
            alt="Generated image"
            className="w-full rounded-lg"
          />
        </div>
      )}
    </div>
  );
}
