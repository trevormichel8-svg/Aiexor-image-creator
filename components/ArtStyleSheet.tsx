"use client";

const ART_STYLES = [
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
  "Infrared",
  "Night Photography",
  "Digital Art",
  "Concept Art",
  "Matte Painting",
  "Environment Art",
  "Character Design",
  "Game Art",
  "Illustration",
  "Anime",
  "Cyberpunk",
  "Steampunk",
  "Dieselpunk",
  "Biopunk",
  "Fantasy",
  "Dark Fantasy",
  "Epic Fantasy",
  "Mythology",
  "Oil Painting",
  "Watercolor",
  "Ink Drawing",
  "Charcoal Sketch",
  "Pencil Drawing",
  "Abstract",
  "Surrealism",
  "Minimalism",
  "Pixel Art",
  "Isometric",
  "Low Poly",
  "3D Render",
  "Unreal Engine",
  "Blender Render",
];

export default function ArtStyleSheet({
  open,
  onSelect,
  onClose,
}: {
  open: boolean;
  onSelect: (style: string) => void;
  onClose: () => void;
}) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur"
      onClick={onClose}
    >
      <div
        className="absolute bottom-0 left-0 right-0 max-h-[70vh] overflow-y-auto bg-black border-t border-red-600/40"
        onClick={(e) => e.stopPropagation()}
      >
        {ART_STYLES.map((style) => (
          <button
            key={style}
            onClick={() => onSelect(style)}
            className="w-full text-left px-6 py-4 text-white border-b border-red-600/20 hover:bg-red-600/10"
            style={{
              textShadow: "0 0 8px rgba(255,60,60,0.8)",
            }}
          >
            {style}
          </button>
        ))}
      </div>
    </div>
  );
}
