"use client";

const artStyles = [
  "Photorealistic",
  "Oil Painting",
  "Watercolor",
  "Charcoal Sketch",
  "Pencil Drawing",
  "Digital Painting",
  "Anime",
  "Cyberpunk",
  "Fantasy Illustration",
  "Concept Art",
  // add more freely
];

type Props = {
  open: boolean;
  onSelect: (style: string) => void;
  onClose: () => void;
  selected?: string; // ✅ optional, prevents build failures
};

export default function ArtStyleSheet({
  open,
  onSelect,
  onClose,
}: Props) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur">
      <div className="absolute bottom-0 left-0 right-0 max-h-[70vh] bg-black border-t border-red-600/40 overflow-y-auto">
        {artStyles.map((style) => (
          <button
            key={style}
            onClick={() => {
              onSelect(style);
              onClose();
            }}
            className="w-full text-left px-4 py-3 text-gray-200 hover:bg-red-600/10 hover:text-white transition"
          >
            {style}
          </button>
        ))}
      </div>
    </div>
  );
}
