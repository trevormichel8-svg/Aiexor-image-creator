"use client";

import artstyle from "@/lib/artstyle";

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
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur">
      <div className="absolute bottom-0 left-0 right-0 max-h-[70vh] bg-black border-t border-red-600/40 overflow-y-auto">
        {artStyles.map((style) => (
          <button
            key={style}
            onClick={() => {
              onSelect(style);
              onClose();
            }}
            className="w-full text-left px-6 py-4 text-red-500 hover:bg-red-500/10 transition"
            style={{
              textShadow: "0 0 10px rgba(255,0,0,0.6)",
            }}
          >
            {style}
          </button>
        ))}
      </div>
    </div>
  );
}
