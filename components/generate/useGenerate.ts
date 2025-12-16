
"use client";
import { useState } from "react";

export function useGenerate() {
  const [prompt, setPrompt] = useState("");
  const [styles, setStyles] = useState<string[]>([]);
  const [modelId, setModelId] = useState("gpt-image-1");
  const [provider, setProvider] = useState("openai");
  const [image, setImage] = useState<string | null>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  return {
    prompt, setPrompt,
    styles, setStyles,
    modelId, setModelId,
    provider, setProvider,
    image, setImage,
    history, setHistory,
    loading, setLoading,
    error, setError,
  };
}
