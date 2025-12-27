"use client";

import { useState } from "react";
import PromptBar from "@/components/PromptBar";

type Message = {
  id: string;
  prompt: string;
  style: string;
  imageUrl: string;
};

export default function HomePage() {
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
      if (!res.ok) throw new Error(data.error || "Generation failed");

      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          prompt,
          style,
          imageUrl: data.image,
        },
      ]);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-black text-white">
      {/* Scrollable canvas / history */}
      <div className="canvas">
        {messages.map((m) => (
          <div key={m.id} className="message">
            <img
              src={m.imageUrl}
              alt={m.prompt}
              className="generated-image"
            />
            <div className="caption">
              {m.prompt}
              <span className="style"> · {m.style}</span>
            </div>
          </div>
        ))}

        {messages.length === 0 && (
          <div className="empty-state">
            Start by entering a prompt below.
          </div>
        )}
      </div>

      {/* Fixed bottom prompt bar */}
      <PromptBar onGenerate={generate} loading={loading} />
    </main>
  );
}
