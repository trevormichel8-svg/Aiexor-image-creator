"use client";

type Props = {
  src: string | null;
  onClose: () => void;
};

export default function ImageLightbox({ src, onClose }: Props) {
  if (!src) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm
      flex items-center justify-center cursor-zoom-out"
    >
      <img
        src={src}
        onClick={e => e.stopPropagation()}
        className="max-w-[90vw] max-h-[90vh] rounded-xl
        shadow-[0_0_60px_rgba(220,38,38,0.6)] border border-red-600/40"
      />
    </div>
  );
}
