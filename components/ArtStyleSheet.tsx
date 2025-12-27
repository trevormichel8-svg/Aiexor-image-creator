"use client";

import artStyles from "@/lib/artStyles";

type Props = {
  open: boolean;
  onSelect: (style: string) => void;
  onClose: () => void;
};

export default function ArtStyleSheet({ open, onSelect, onClose }: Props) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-40 bg-black/80 backdrop-blur"
      onClick={onClose}
    >
      <div
        className="absolute bottom-0 left-0 right-0 max-h-[70vh] bg-black border-t border-red-600/40 overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <ul className="p-4 space-y-3">
          {artStyles.map((style) => (
            <li
              key={style}
              onClick={() => onSelect(style)}
              className="text-red-400 text-lg cursor-pointer hover:text-red-300 transition drop-shadow-[0_0_6px_rgba(255,0,0,0.6)]"
            >
              {style}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
