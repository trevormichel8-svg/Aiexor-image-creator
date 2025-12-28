"use client";

import { useState } from "react";
import PromptBar from "@/components/PromptBar";

type Message = {
  id: string;
  prompt: string;
  style: string;
  image?: string;
  error?: string;
};

export default function HomePage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);

  async function handleGenerate(prompt: string, style: string) {
    const id = crypto.randomUUID();

    const compiledPrompt =
      style && style !== "Default"
        ? `${prompt}. Style: ${style}`
        : prompt;

    // optimistic placeholder
    setMessages((prev) => [
      ...prev,
      { id, prompt, style }
    ]);

    setLoading(true);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: compiledPrompt })
      });

      const data = await res.json();

      if (!res.ok || !data.image) {
        throw new Error("Generation failed");
      }

      setMessages((prev) =>
        prev.map((m) =>
          m.id === id ? { ...m, image: data.image } : m
        )
      );
    } catch (e) {
      setMessages((prev) =>
        prev.map((m) =>
          m.id === id
            ? { ...m, error: "Image generation failed" }
            : m
        )
      );
    } finally {
      setLoading(false);
    }
  }

  function deleteMessage(id: string) {
    setMessages((prev) => prev.filter((m) => m.id !== id));
  }

  function clearHistory() {
    if (confirm("Clear all image history?")) {
      setMessages([]);
    }
  }

  return (
    <main className="min-h-screen bg-black text-white pb-32">
      <header className="p-4 flex justify-between items-center">
        <h1 className="text-lg font-semibold">Aiexor</h1>
        <button
          onClick={clearHistory}
          className="text-sm text-red-400"
        >
          Clear history
        </button>
      </header>

      <section className="space-y-6 px-4">
        {messages.map((m) => (
          <div
            key={m.id}
            className="rounded-xl bg-[#0b0b0b] border border-red-800 p-3"
          >
            <div className="text-sm opacity-70 mb-2">
              {m.prompt}
              {m.style && ` · ${m.style}`}
            </div>

            {m.image && (
              <img
                src={`data:image/png;base64,${m.image}`}
                alt={m.prompt}
                className="rounded-lg w-full"
              />
            )}

            {m.error && (
              <div className="text-red-400 text-sm">
                {m.error}
              </div>
            )}

            <button
              onClick={() => deleteMessage(m.id)}
              className="mt-2 text-xs text-red-400"
            >
              Delete
            </button>
          </div>
        ))}
      </section>

      <PromptBar
        onGenerate={handleGenerate}
        loading={loading}
      />
    </main>
  );
}
