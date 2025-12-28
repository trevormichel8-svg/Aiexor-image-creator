"use client";

import { useEffect, useState } from "react";
import PromptBar from "@/components/PromptBar";

type GeneratedImage = {
  url: string;
  prompt: string;
  style: string;
  strength: number;
};

type Session = {
  id: string;
  createdAt: number;
  images: GeneratedImage[];
};

export default function Page() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [zoomSrc, setZoomSrc] = useState<string | null>(null);

  /* ---------- Persistence ---------- */
  useEffect(() => {
    const saved = localStorage.getItem("sessions");
    if (saved) {
      const parsed: Session[] = JSON.parse(saved);
      setSessions(parsed);
      setActiveSessionId(parsed[0]?.id ?? null);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("sessions", JSON.stringify(sessions));
  }, [sessions]);

  const activeSession = sessions.find(s => s.id === activeSessionId) ?? null;

  /* ---------- Generate ---------- */
  async function handleGenerate(
    prompt: string,
    style: string,
    strength: number
  ) {
    setLoading(true);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: `${prompt}, ${style} style (${strength}%)`,
        }),
      });

      const data = await res.json();
      if (!data?.image) throw new Error("No image returned");

      const image: GeneratedImage = {
        url: data.image,
        prompt,
        style,
        strength,
      };

      setSessions(prev => {
        // create session if none
        if (!activeSessionId) {
          const newSession: Session = {
            id: crypto.randomUUID(),
            createdAt: Date.now(),
            images: [image],
          };
          setActiveSessionId(newSession.id);
          return [newSession, ...prev];
        }

        return prev.map(s =>
          s.id === activeSessionId
            ? { ...s, images: [...s.images, image] }
            : s
        );
      });
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  /* ---------- Delete Image ---------- */
  function deleteImage(index: number) {
    if (!activeSession) return;

    setSessions(prev =>
      prev.map(s =>
        s.id === activeSession.id
          ? {
              ...s,
              images: s.images.filter((_, i) => i !== index),
            }
          : s
      )
    );
  }

  /* ---------- Clear History ---------- */
  function clearHistory() {
    setSessions([]);
    setActiveSessionId(null);
    localStorage.removeItem("sessions");
  }

  return (
    <main className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Top bar */}
      <div className="fixed top-0 left-0 right-0 z-40 flex justify-between px-4 py-3">
        <button
          onClick={clearHistory}
          className="text-xs text-red-400 hover:text-red-300"
        >
          Clear history
        </button>

        <button
          onClick={() => setActiveSessionId(null)}
          className="text-xs text-red-400 hover:text-red-300"
        >
          New session
        </button>
      </div>

      {/* Canvas */}
      <div className="pt-16 pb-40 px-4 max-w-5xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {activeSession?.images.map((img, i) => (
            <div
              key={i}
              className="group relative rounded-xl overflow-hidden
              border border-red-600/40
              shadow-[0_0_30px_rgba(220,38,38,0.35)]"
            >
              <img
                src={img.url}
                onClick={() => setZoomSrc(img.url)}
                className="w-full object-contain bg-black cursor-zoom-in"
              />

              {/* Hover actions */}
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition flex gap-2">
                <button
                  onClick={() => setZoomSrc(img.url)}
                  className="bg-black/70 rounded-full px-2 py-1 text-red-400"
                >
                  🔍
                </button>
                <button
                  onClick={() => deleteImage(i)}
                  className="bg-black/70 rounded-full px-2 py-1 text-red-400"
                >
                  🗑
                </button>
              </div>

              <div className="text-xs text-red-300 p-2">
                {img.style} · {img.strength}%
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Zoom modal */}
      {zoomSrc && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center"
          onClick={() => setZoomSrc(null)}
        >
          <img src={zoomSrc} className="max-h-[90vh] max-w-[90vw]" />
        </div>
      )}

      {/* Prompt bar */}
      <PromptBar onGenerate={handleGenerate} loading={loading} />
    </main>
  );
}
