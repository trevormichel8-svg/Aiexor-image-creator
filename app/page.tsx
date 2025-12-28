"use client";

import { useState } from "react";
import PromptBar from "@/components/PromptBar";
import { Session, createSession } from "@/lib/session";

export default function HomePage() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const activeSession = sessions.find(s => s.id === activeId);

  async function handleGenerate(
    prompt: string,
    style: string,
    strength: number
  ) {
    setLoading(true);

    const compiledPrompt = `
${prompt}
Art style: ${style}
Style strength: ${strength}%
Ultra-detailed, cinematic lighting
`;

    let session = activeSession;

    if (!session) {
      session = createSession(prompt);
      setSessions(prev => [session!, ...prev]);
      setActiveId(session.id);
    }

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: compiledPrompt }),
      });

      const data = await res.json();

      if (data?.image) {
        setSessions(prev =>
          prev.map(s =>
            s.id === session!.id
              ? {
                  ...s,
                  images: [
                    {
                      url: data.image,
                      prompt,
                      style,
                    },
                    ...s.images,
                  ],
                }
              : s
          )
        );
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-black text-white flex">
      {/* Sidebar */}
      <aside className="w-64 border-r border-red-600/30 p-3 space-y-2">
        <button
          onClick={() => setActiveId(null)}
          className="w-full text-red-400 text-sm mb-4"
        >
          + New Chat
        </button>

        {sessions.map(s => (
          <button
            key={s.id}
            onClick={() => setActiveId(s.id)}
            className={`block w-full text-left text-sm px-2 py-1 rounded
              ${s.id === activeId ? "bg-red-600/20" : "hover:bg-red-600/10"}
            `}
          >
            {s.title}
          </button>
        ))}
      </aside>

      {/* Canvas */}
      <section className="flex-1 relative">
        <div className="pt-12 pb-40 px-6 max-w-5xl mx-auto space-y-8">
          {activeSession?.images.map((img, i) => (
            <div
              key={i}
              className="border border-red-600/40 rounded-xl overflow-hidden
              shadow-[0_0_30px_rgba(220,38,38,0.35)]"
            >
              <img
                src={img.url}
                className="w-full object-contain bg-black cursor-zoom-in"
              />
              <div className="text-xs text-red-300 p-2">
                {img.style}
              </div>
            </div>
          ))}

          {!activeSession && (
            <div className="text-center text-gray-500 mt-32">
              Start a new image below
            </div>
          )}
        </div>

        <PromptBar onGenerate={handleGenerate} loading={loading} />
      </section>
    </main>
  );
}
