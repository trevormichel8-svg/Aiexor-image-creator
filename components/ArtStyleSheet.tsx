"use client";

import { ART_STYLES } from "@/lib/artStyles";

type Props = {
  open: boolean;
  onSelect: (style: string) => void;
  onClose: () => void;
};

export default function ArtStyleSheet({ open, onSelect, onClose }: Props) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur">
      <div className="absolute bottom-0 left-0 right-0 max-h-[70vh] overflow-y-auto border-t border-red-600/40 bg-black">
        <div className="p-4 space-y-3">
          {ART_STYLES.map((style) => (
            <button
              key={style}
              onClick={() => {
                onSelect(style);
                onClose();
              }}
              className="w-full text-left text-lg font-medium text-red-400 hover:text-red-300 transition"
              style={{
                textShadow: "0 0 10px rgba(255,0,0,0.6)",
              }}
            >
              {style}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
