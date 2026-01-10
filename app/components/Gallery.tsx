"use client"

import { useState } from "react"

type ImageItem = {
  id: string
  src: string
}

export default function Gallery({ isFree }: { isFree: boolean }) {
  const [images, setImages] = useState<ImageItem[]>([
    { id: "1", src: "/placeholder1.png" },
    { id: "2", src: "/placeholder2.png" },
    { id: "3", src: "/placeholder3.png" },
  ])

  function deleteImage(id: string) {
    const confirmDelete = confirm("Delete this image?")
    if (!confirmDelete) return

    setImages((prev) => prev.filter((img) => img.id !== id))
  }

  function handleDownload() {
    alert("Upgrade required to download images")
  }

  if (images.length === 0) {
    return (
      <div className="text-center text-zinc-400 mt-8">
        No images yet
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 gap-3">
      {images.map((img) => (
        <div
          key={img.id}
          className="relative bg-zinc-900 rounded overflow-hidden"
        >
          {/* IMAGE */}
          <img
            src={img.src}
            alt="generated"
            className={`w-full ${isFree ? "opacity-60" : ""}`}
          />

          {/* WATERMARK */}
          {isFree && (
            <div className="absolute inset-0 flex items-center justify-center text-white text-xl font-bold opacity-70 pointer-events-none">
              Aiexor
            </div>
          )}

          {/* ACTION BAR */}
          <div className="absolute bottom-1 right-1 flex gap-1">
            <button
              onClick={isFree ? handleDownload : undefined}
              className="bg-black text-white text-xs px-2 py-1 rounded"
            >
              {isFree ? "Upgrade" : "Download"}
            </button>

            <button
              onClick={() => deleteImage(img.id)}
              className="bg-red-600 text-white text-xs px-2 py-1 rounded"
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}
