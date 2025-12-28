const STYLES: string[] = [
  // Default
  "Default",

  // Photography
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

  // Digital / Concept
  "Digital Art",
  "Concept Art",
  "Matte Painting",
  "Environment Art",
  "Character Design",
  "Game Art",
  "Splash Art",
  "Key Art",
  "Illustration",

  // Anime / Manga
  "Anime",
  "Manga",
  "Chibi",
  "Studio Ghibli",
  "Kawaii",
  "Mecha",
  "Cyberpunk Anime",
  "Dark Anime",
  "Isekai",

  // Sci-Fi / Futurism
  "Cyberpunk",
  "Steampunk",
  "Dieselpunk",
  "Biopunk",
  "Retrofuturism",
  "Futuristic Sci-Fi",
  "Space Art",
  "Galaxy",
  "Nebula",
  "Alien World",

  // Fantasy
  "Fantasy",
  "Dark Fantasy",
  "High Fantasy",
  "Epic Fantasy",
  "Mythology",
  "Medieval Fantasy",
  "Dungeons and Dragons",
  "Magic Realism",

  // Traditional Art
  "Oil Painting",
  "Watercolor",
  "Acrylic Painting",
  "Ink Drawing",
  "Charcoal Sketch",
  "Pencil Drawing",
  "Pastel Drawing",
  "Ink Wash",

  // Art Movements
  "Impressionism",
  "Expressionism",
  "Abstract",
  "Abstract Expressionism",
  "Surrealism",
  "Cubism",
  "Pop Art",
  "Minimalism",
  "Modern Art",
  "Art Nouveau",
  "Art Deco",
  "Baroque",
  "Renaissance",
  "Ukiyo-e",

  // Stylized / Low-Poly
  "Pixel Art",
  "8-bit",
  "16-bit",
  "Retro Game Art",
  "Isometric",
  "Low Poly",
  "Voxel Art",
  "Wireframe",
  "Blueprint",

  // 3D / Rendering
  "3D Render",
  "Hyperreal 3D",
  "Octane Render",
  "Unreal Engine",
  "Blender Render",
  "ZBrush Sculpt",
  "Clay Render",

  // Graphic / Design
  "Graffiti",
  "Street Art",
  "Tattoo Flash",
  "Album Cover",
  "Poster Design",
  "Editorial Illustration",
  "Comic Book",
  "Graphic Novel",
  "Line Art",
  "Flat Design"
];

export default function ArtStyleSheet({
  open,
  onSelect,
  onClose
}: {
  open: boolean;
  onSelect: (style: string) => void;
  onClose: () => void;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/80 z-40">
      <div className="absolute bottom-0 w-full max-h-[65%] bg-[#0b0b0b] rounded-t-xl p-4 overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-semibold text-white">Art Style</h2>
          <button
            onClick={onClose}
            className="text-white text-lg"
          >
            ✕
          </button>
        </div>

        <div className="flex flex-wrap gap-2">
          {STYLES.map((style) => (
            <button
              key={style}
              onClick={() => onSelect(style)}
              className="px-3 py-1 rounded-full border border-red-700 text-sm text-white hover:bg-red-700/20 transition"
            >
              {style}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
