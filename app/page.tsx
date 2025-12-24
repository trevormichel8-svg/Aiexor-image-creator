"use client";

import { useState } from "react";

const ART_STYLES = [
  // Photographic
  "Photorealistic",
  "Ultra Realistic",
  "DSLR Photography",
  "Studio Lighting",
  "Cinematic Photography",
  "Long Exposure",
  "Macro Photography",
  "Portrait Photography",
  "Street Photography",
  "Night Photography",

  // Digital / Concept
  "Concept Art",
  "Digital Painting",
  "Matte Painting",
  "Keyframe Art",
  "Environment Art",
  "Character Design",
  "Sci-Fi Concept",
  "Fantasy Concept",
  "Game Art",
  "Movie Concept Art",

  // Illustration
  "Illustration",
  "Editorial Illustration",
  "Children’s Book",
  "Comic Style",
  "Graphic Novel",
  "Line Art",
  "Ink Illustration",
  "Vector Illustration",
  "Flat Illustration",
  "Minimal Illustration",

  // Painting
  "Oil Painting",
  "Watercolor",
  "Acrylic Painting",
  "Gouache",
  "Impressionist",
  "Expressionist",
  "Abstract Painting",
  "Surreal Painting",
  "Classic Renaissance",
  "Baroque",

  // Anime / Manga
  "Anime",
  "Manga",
  "Anime Cinematic",
  "Studio Ghibli Style",
  "Shonen Style",
  "Seinen Style",
  "Chibi",
  "Anime Realism",
  "Cyber Anime",
  "Mecha Anime",

  // 3D / Render
  "3D Render",
  "Octane Render",
  "Unreal Engine",
  "Blender Render",
  "Cinema 4D",
  "Isometric 3D",
  "Low Poly",
  "High Poly",
  "Clay Render",
  "Product Render",

  // Sci-Fi / Futuristic
  "Cyberpunk",
  "Biopunk",
  "Steampunk",
  "Futuristic",
  "Dystopian",
  "Utopian",
  "Space Art",
  "Alien World",
  "Mecha",
  "Hard Sci-Fi",

  // Fantasy
  "High Fantasy",
  "Dark Fantasy",
  "Epic Fantasy",
  "Mythological",
  "Sword and Sorcery",
  "Fairy Tale",
  "Magical Realism",
  "Dragon Fantasy",
  "Elven Fantasy",
  "Medieval Fantasy",

  // Retro / Stylized
  "Pixel Art",
  "Voxel Art",
  "8-bit",
  "16-bit",
  "Synthwave",
  "Vaporwave",
  "Retro Futurism",
  "90s Anime",
  "80s Sci-Fi",
  "Comic Pop Art",

  // Architecture / Design
  "Architectural Visualization",
  "Interior Design",
  "Exterior Design",
  "Futuristic Architecture",
  "Minimal Architecture",
  "Brutalist",
  "Organic Architecture",
  "Isometric Architecture",
  "Concept Architecture",
  "Urban Design"
];

export default function Page() {
  const [prompt, setPrompt] = useState("");
  const [style, setStyle] = useState(ART_STYLES[0]);
  const [loading, setLoading] = useState(false);

  return (
    <div className="generator-card">
      <h1 style={{ fontSize: "1.4rem", fontWeight: 600 }}>
        Aiexor Image Generator
      </h1>

      <textarea
        placeholder="Describe the image you want to create..."
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        rows={4}
      />

      <select value={style} onChange={(e) => setStyle(e.target.value)}>
        {ART_STYLES.map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </select>

      <button
        disabled={loading || !prompt}
        onClick={() => {
          setLoading(true);
          setTimeout(() => setLoading(false), 1200);
        }}
      >
        {loading ? "Generating..." : "Generate"}
      </button>

      <p style={{ fontSize: "0.8rem", opacity: 0.6, textAlign: "center" }}>
        Images generated using OpenAI
      </p>
    </div>
  );
}
