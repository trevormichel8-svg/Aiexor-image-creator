"use client";

import { useState } from "react";
import PromptBar from "@/components/PromptBar";

type Message = {
  id: string;
  prompt: string;
  style: string;
  imageUrl: string;
};

export default function Page() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);

  async function generate(prompt: string, style: string) {
    if (!prompt.trim()) return;

    setLoading(true);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, style }),
      });

      const data = await res.json();

      if (!data?.image) {
        throw new Error("No image returned");
      }

      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          prompt,
          style,
          imageUrl: data.image.startsWith("data:")
            ? data.image
            : `data:image/png;base64,${data.image}`,
        },
      ]);
    } catch (err) {
      console.error("Image generation failed", err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="relative min-h-screen bg-black text-white">
      {/* Image history canvas */}
      <div className="pb-40 px-4 space-y-6">
        {messages.map((m) => (
          <div key={m.id}>
            <div className="text-sm text-red-400 mb-2">
              {m.prompt} · {m.style}
            </div>
            <img
              src={m.imageUrl}
              alt={m.prompt}
              className="rounded-xl shadow-[0_0_30px_rgba(255,0,0,0.45)] max-w-full"
            />
          </div>
        ))}
      </div>

      {/* Bottom prompt bar */}
      <PromptBar onGenerate={generate} loading={loading} />
    </main>
  );
}
