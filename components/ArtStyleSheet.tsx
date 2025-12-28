"use client";

import { useEffect, useMemo, useState } from "react";

const STYLES: string[] = [
  "Default",
  "Photorealistic",
  "Ultra Realistic",
  "Cinematic",
  "HDR",
  "Studio Lighting",
  "Portrait Photography",
  "Macro Photography",
  "Long Exposure",
  "Bokeh",
  "Film Grain",
  "Analog Photo",
  "Polaroid",
  "Night Photography",

  "Digital Art",
  "Concept Art",
  "Matte Painting",
  "Environment Art",
  "Character Design",
  "Game Art",
  "Illustration",

  "Anime",
  "Manga",
  "Chibi",
  "Studio Ghibli",
  "Cyberpunk Anime",
  "Dark Anime",

  "Cyberpunk",
  "Steampunk",
  "Retrofuturism",
  "Space Art",
  "Galaxy",
  "Nebula",

  "Fantasy",
  "Dark Fantasy",
  "Epic Fantasy",
  "Mythology",
  "Medieval Fantasy",

  "Oil Painting",
  "Watercolor",
  "Ink Drawing",
  "Charcoal Sketch",
  "Pencil Drawing",

  "Impressionism",
  "Abstract",
  "Surrealism",
  "Pop Art",
  "Minimalism",
  "Art Deco",

  "Pixel Art",
  "Low Poly",
  "Isometric",
  "Voxel Art",

  "3D Render",
  "Unreal Engine",
  "Blender Render",

  "Graffiti",
  "Album Cover",
  "Poster Design",
  "Comic Book",
  "Line Art"
];

type Props = {
  open: boolean;
  onSelect: (style: string, strength: number) => void;
  onClose: () => void;
};

export default function ArtStyleSheet({ open, onSelect, onClose }: Props) {
  const [query, setQuery] = useState("");
  const [favorites, setFavorites] = useState<string[]>([]);
  const [recent, setRecent] = useState<string[]>([]);
  const [strength, setStrength] = useState(70);

  // Load persisted data
  useEffect(() => {
    setFavorites(JSON.parse(localStorage.getItem("art-favorites") || "[]"));
    setRecent(JSON.parse(localStorage.getItem("art-recent") || "[]"));
  }, []);

  const toggleFavorite = (style: string) => {
    const updated = favorites.includes(style)
      ? favorites.filter((s) => s !== style)
      : [...favorites, style];
    setFavorites(updated);
    localStorage.setItem("art-favorites", JSON.stringify(updated));
  };

  const handleSelect = (style: string) => {
    const updatedRecent = [style, ...recent.filter((s) => s !== style)].slice(0, 8);
    setRecent(updatedRecent);
    localStorage.setItem("art-recent", JSON.stringify(updatedRecent));
    onSelect(style, strength);
    onClose();
  };

  const filtered = useMemo(() => {
    return STYLES.filter((s) =>
      s.toLowerCase().includes(query.toLowerCase())
    );
  }, [query]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80">
      <div className="absolute bottom-0 w-full max-h-[70%] bg-[#0b0b0b] rounded-t-xl p-4 overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-white font-semibold">Art Styles</h2>
          <button onClick={onClose} className="text-white text-lg">✕</button>
        </div>

        {/* Search */}
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search styles…"
          className="w-full mb-3 px-3 py-2 rounded-md bg-black border border-red-600 text-white outline-none"
        />

        {/* Strength */}
        <div className="mb-4">
          <label className="text-sm text-white">
            Style strength: <span className="text-red-500">{strength}%</span>
          </label>
          <input
            type="range"
            min={0}
            max={100}
            value={strength}
            onChange={(e) => setStrength(Number(e.target.value))}
            className="w-full accent-red-600"
          />
        </div>

        {/* Favorites */}
        {favorites.length > 0 && (
          <>
            <h3 className="text-xs text-red-400 mb-2">Favorites</h3>
            <div className="flex flex-wrap gap-2 mb-4">
              {favorites.map((style) => (
                <button
                  key={style}
                  onClick={() => handleSelect(style)}
                  className="px-3 py-1 rounded-full border border-red-600 text-white"
                >
                  ⭐ {style}
                </button>
              ))}
            </div>
          </>
        )}

        {/* Recent */}
        {recent.length > 0 && (
          <>
            <h3 className="text-xs text-red-400 mb-2">Recent</h3>
            <div className="flex flex-wrap gap-2 mb-4">
              {recent.map((style) => (
                <button
                  key={style}
                  onClick={() => handleSelect(style)}
                  className="px-3 py-1 rounded-full border border-red-600/60 text-white"
                >
                  {style}
                </button>
              ))}
            </div>
          </>
        )}

        {/* All Styles */}
        <h3 className="text-xs text-red-400 mb-2">All Styles</h3>
        <div className="flex flex-wrap gap-2">
          {filtered.map((style) => (
            <div key={style} className="flex items-center gap-1">
              <button
                onClick={() => handleSelect(style)}
                className="px-3 py-1 rounded-full border border-red-700 text-white hover:bg-red-700/20"
              >
                {style}
              </button>
              <button
                onClick={() => toggleFavorite(style)}
                className="text-red-500"
              >
                {favorites.includes(style) ? "★" : "☆"}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
