"use client";

export default function ImageCanvas({ images }: { images: string[] }) {
  return (
    <div className="pt-16 pb-32 px-4 space-y-6">
      {images.map((src, i) => (
        <img
          key={i}
          src={src}
          className="rounded-xl shadow-[0_0_40px_rgba(255,0,0,0.5)] mx-auto"
        />
      ))}
    </div>
  );
}
