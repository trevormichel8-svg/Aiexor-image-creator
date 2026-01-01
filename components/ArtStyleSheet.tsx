"use client";

export const ART_STYLES = [
  // Core
 "Art Style",
  "Indigenous",
  "Coloring Book",
  "Default",
  "Realistic",
  "Ultra Realistic",
  "Photorealistic",
  "Hyperrealism",

  // Illustration
  "Digital Illustration",
  "Concept Art",
  "Matte Painting",
  "Fantasy Illustration",
  "Sci-Fi Illustration",

  // Anime / Stylized
  "Anime",
  "Chibi",
  "Manga",
  "Studio Ghibli",
  "Kawaii",
  "Cartoon",
  "Comic Book",

  // Traditional Art
  "Oil Painting",
  "Watercolor",
  "Acrylic Painting",
  "Gouache",
  "Ink Drawing",
  "Charcoal",
  "Pastel",
  "Pencil Sketch",

  // 3D / Render
  "3D Render",
  "Octane Render",
  "Unreal Engine",
  "Cinema 4D",
  "Blender",
  "Clay Render",

  // Abstract / Experimental
  "Abstract",
  "Surreal",
  "Dreamlike",
  "Double Exposure",
  "Glitch Art",
  "Low Poly",
  "Voxel",
  "Isometric",

  // Retro / Vintage
  "Pixel Art",
  "8-Bit",
  "16-Bit",
  "Retro Futurism",
  "Vaporwave",
  "Synthwave",
  "Film Grain",
  "Analog Photo",

  // Photography Styles
  "Portrait Photography",
  "Cinematic Photography",
  "Street Photography",
  "Macro Photography",
  "Long Exposure",
  "Bokeh",
  "HDR",

  // Design / UI
  "Flat Design",
  "Minimalist",
  "Neon Noir",
  "Cyberpunk",
  "Futuristic",

  // Dark / Mood
  "Dark Fantasy",
  "Gothic",
  "Horror",
  "Noir",
  "Moody Lighting",

  // Decorative
  "Line Art",
  "Silhouette",
  "Tattoo Style",
  "Sticker Style",
  "Vector Art",
];

interface ArtStyleSheetProps {
  open: boolean;
  onClose: () => void;
  value: string;
  onChange: (style: string) => void;
}

export default function ArtStyleSheet({
  open,
  onClose,
  value,
  onChange,
}: ArtStyleSheetProps) {
  if (!open) return null;

  return (
    <div className="art-style-overlay">
      <div className="art-style-modal">
        {ART_STYLES.map((style) => (
          <button
            key={style}
            className={`art-style-option ${
              value === style ? "active" : ""
            }`}
            onClick={() => {
              onChange(style);
              onClose();
            }}
          >
            {style}
          </button>
        ))}
      </div>
    </div>
  );
}
