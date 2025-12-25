"use client";

import { artStyles } from "@/lib/artStyles";

type Props = {
  open: boolean;
  onSelect: (style: string) => void;
  onClose: () => void;
};

export default function ArtStyleSheet({ open, onSelect, onClose }: Props) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur">
      <div className="absolute bottom-0 left-0 right-0 max-h-[70vh] bg-black border-t border-red-600/40 overflow-y-auto">
        <div className="p-4 space-y-2">
          {artStyles.map((style) => (
            <button
              key={style}
              onClick={() => onSelect(style)}
              className="block w-full text-left text-white text-sm py-2 px-3 rounded
                         hover:bg-red-600/20
                         shadow-[0_0_10px_rgba(255,0,0,0.4)]"
            >
              {style}
            </button>
          ))}
        </div>

        <button
          onClick={onClose}
          className="w-full py-3 text-red-400 border-t border-red-600/30"
        >
          Close
        </button>
      </div>
    </div>
  );
}
