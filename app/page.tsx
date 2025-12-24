"use client";

import { useState } from "react";

type ImageItem = {
  prompt: string;
  image: string;
};

type ChatSession = {
  id: string;
  title: string;
  images: ImageItem[];
};

const ART_STYLES = [ /* same 100+ list as before */ 
  "Photorealistic","Ultra Realistic","Cinematic","HDR","Studio Lighting",
  "Portrait Photography","Macro Photography","Long Exposure","Bokeh",
  "Film Grain","Analog Photo","Polaroid","Infrared","Night Photography",
  "Digital Art","Concept Art","Fantasy","Cyberpunk","Anime","Pixel Art",
  "3D Render","Oil Painting","Watercolor","Abstract","Surrealism",
  "Minimalism","Art Deco","Renaissance","Ukiyo-e","Low Poly","Voxel Art",
  "Blueprint","Unreal Engine","Graffiti","Line Art","Poster Design"
];

export default function Page() {
  const [prompt, setPrompt] = useState("");
  const [style, setStyle] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [current, setCurrent] = useState<ChatSession>({
    id: crypto.randomUUID(),
    title: "New Chat",
    images: []
  });

  const [showStyles, setShowStyles] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);

  async function generate() {
    if (!prompt) return;
    setLoading(true);

    const res = await fetch("/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        prompt: style ? `${prompt}, ${style}` : prompt
      })
    });

    const data = await res.json();

    const updated = {
      ...current,
      title: current.images.length === 0 ? prompt.slice(0, 32) : current.title,
      images: [...current.images, { prompt, image: data.image }]
    };

    setCurrent(updated);
    setPrompt("");
    setLoading(false);
  }

  function newChat() {
    if (current.images.length) {
      setSessions([current, ...sessions]);
    }
    setCurrent({
      id: crypto.randomUUID(),
      title: "New Chat",
      images: []
    });
  }

  function loadChat(chat: ChatSession) {
    setCurrent(chat);
    setShowSidebar(false);
  }

  return (
    <main className="relative min-h-screen bg-black text-white overflow-hidden">

      {/* STARFIELD */}
      <div className="absolute inset-0 starfield" />

      {/* TOP BAR */}
      <div className="fixed top-4 left-4 right-4 z-30 flex justify-between">
        <button
          onClick={() => setShowSidebar(true)}
          className="px-4 py-2 rounded-full border border-red-600 shadow-[0_0_15px_red]"
        >
          ☰
        </button>
        <button
          onClick={newChat}
          className="px-4 py-2 rounded-full border border-red-600 shadow-[0_0_15px_red]"
        >
          ＋ New Chat
        </button>
      </div>

      {/* SIDEBAR */}
      {showSidebar && (
        <aside className="fixed inset-y-0 left-0 w-72 bg-black/95 border-r border-red-700 z-40 p-4 overflow-y-auto">
          <h2 className="mb-4 text-red-400">Chat History</h2>
          {sessions.map(s => (
            <div
              key={s.id}
              onClick={() => loadChat(s)}
              className="cursor-pointer mb-2 text-sm hover:text-white hover:drop-shadow-[0_0_6px_red]"
            >
              {s.title}
            </div>
          ))}
          <button
            onClick={() => setShowSidebar(false)}
            className="mt-6 text-xs text-red-400"
          >
            Close
          </button>
        </aside>
      )}

      {/* CANVAS / HISTORY */}
      <div className="relative z-10 pt-20 pb-32 px-4 max-w-3xl mx-auto overflow-y-auto space-y-12">
        {current.images.map((item, i) => (
          <div key={i} className="space-y-2">
            <p className="text-sm text-zinc-400">{item.prompt}</p>
            <img
              src={item.image}
              className="rounded-xl shadow-[0_0_40px_rgba(255,0,0,0.8)]"
            />
          </div>
        ))}
      </div>

      {/* STYLE MENU */}
      {showStyles && (
        <div className="fixed bottom-24 left-4 right-4 max-h-[50vh] overflow-y-auto bg-black/95 border border-red-700 rounded-xl p-4 z-30">
          {ART_STYLES.map(s => (
            <div
              key={s}
              onClick={() => {
                setStyle(s);
                setShowStyles(false);
              }}
              className="cursor-pointer text-sm mb-2 text-red-300 hover:text-white hover:drop-shadow-[0_0_6px_red]"
            >
              {s}
            </div>
          ))}
        </div>
      )}

      {/* PROMPT BAR */}
      <div className="fixed bottom-4 left-4 right-4 z-40 flex items-center gap-2 bg-zinc-900 rounded-full px-4 py-3 shadow-[0_0_25px_rgba(255,0,0,0.8)] border border-red-700">
        <button
          onClick={() => setShowStyles(v => !v)}
          className="w-9 h-9 rounded-full border border-red-600 shadow-[0_0_15px_red]"
        >
          +
        </button>
        <input
          value={prompt}
          onChange={e => setPrompt(e.target.value)}
          placeholder="Describe the image…"
          className="flex-1 bg-transparent outline-none text-sm"
        />
        <button
          onClick={generate}
          disabled={loading}
          className="px-4 py-2 rounded-full bg-red-600 text-black font-semibold shadow-[0_0_20px_rgba(255,0,0,0.9)]"
        >
          {loading ? "Generating…" : "Generate"}
        </button>
      </div>

      <style jsx global>{`
        .starfield {
          background:
            radial-gradient(1px 1px at 20% 30%, white, transparent),
            radial-gradient(1px 1px at 80% 40%, white, transparent),
            radial-gradient(1px 1px at 50% 80%, white, transparent),
            black;
          animation: drift 80s linear infinite;
        }
        @keyframes drift {
          from { background-position: 0 0; }
          to { background-position: 2000px 2000px; }
        }
      `}</style>
    </main>
  );
}
