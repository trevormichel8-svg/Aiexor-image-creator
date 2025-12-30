"use client";

const ART_STYLES = [
  "None",
  "Photorealistic",
  "Cinematic",
  "Cyberpunk",
  "Synthwave",
  "Anime",
  "Manga",
  "Oil Painting",
  "Watercolor",
  "Charcoal Sketch",
  "Pencil Drawing",
  "Ink Illustration",
  "Digital Art",
  "Concept Art",
  "Fantasy Art",
  "Sci-Fi Art",
  "Dark Fantasy",
  "Gothic",
  "Surrealism",
  "Abstract",
  "Minimalist",
  "Isometric",
  "Low Poly",
  "Voxel Art",
  "Pixel Art",
  "8-Bit",
  "16-Bit",
  "Retro",
  "Vintage",
  "Art Deco",
  "Pop Art",
  "Street Art",
  "Graffiti",
  "Comic Book",
  "Graphic Novel",
  "Ukiyo-e",
  "Japanese Ink",
  "Chinese Brush",
  "Renaissance",
  "Baroque",
  "Impressionist",
  "Expressionist",
  "Cubism",
  "Futurism",
  "Brutalism",
  "Neon Noir",
  "Dark Academia",
  "Light Academia",
  "Vaporwave",
  "Dreamcore",
  "Weirdcore",
  "Solarpunk",
  "Steampunk",
  "Dieselpunk",
  "Biomechanical",
  "Horror",
  "Lovecraftian",
  "Mythological",
  "Hyperrealism",
  "Ultra-Detailed",
  "Macro Photography",
  "Tilt-Shift",
  "Long Exposure",
  "Studio Lighting",
  "Backlit",
  "Volumetric Light",
  "God Rays",
  "HDR",
  "Matte Painting",
  "Environment Concept",
  "Character Concept",
  "Product Render",
  "Architectural Render",
  "Interior Design",
  "Fashion Editorial",
  "Album Cover",
  "Poster Design",
  "Logo Concept",
  "Tattoo Design",
  "Sticker Design",
  "Blueprint",
  "Technical Drawing",
  "Medical Illustration",
  "Scientific Illustration",
  "Children’s Book",
  "Storybook",
  "Claymation",
  "Stop Motion",
  "Paper Cutout"
];

type Props = {
  open: boolean;
  selected: string;
  strength: number;
  onSelect: (style: string) => void;
  onStrength: (v: number) => void;
  onClose: () => void;
};

export default function ArtStyleSheet({
  open,
  selected,
  strength,
  onSelect,
  onStrength,
  onClose,
}: Props) {
  if (!open) return null;

  return (
    <div className="sidebar-overlay" onClick={onClose}>
      <div className="sidebar open" onClick={(e) => e.stopPropagation()}>
        <div className="sidebar-header">
          <strong>Art Styles</strong>
          <button className="prompt-style-btn" onClick={onClose}>✕</button>
        </div>

        <div className="sidebar-content">
          {ART_STYLES.map((s) => (
            <button
              key={s}
              className="sidebar-item"
              style={{
                color: s === selected ? "#ff4444" : "white",
              }}
              onClick={() => onSelect(s)}
            >
              {s}
            </button>
          ))}

          <div style={{ padding: 12 }}>
            <label>Style Strength</label>
            <input
              type="range"
              min={0}
              max={1}
              step={0.05}
              value={strength}
              onChange={(e) => onStrength(Number(e.target.value))}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
