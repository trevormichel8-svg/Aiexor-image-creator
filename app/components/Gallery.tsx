"use client"

import { useEffect, useState } from "react"

type ImageItem = {
  id: string
  src: string
  isVariation?: boolean
}

const PAGE_SIZE = 6

export default function Gallery({ isFree }: { isFree: boolean }) {
  const [allImages, setAllImages] = useState<ImageItem[]>([])
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE)

  // Mock initial images
  useEffect(() => {
    const generated = Array.from({ length: 20 }).map((_, i) => ({
      id: `${i}`,
      src: `/placeholder${(i % 3) + 1}.png`,
    }))
    setAllImages(generated)
  }, [])

  function loadMore() {
    setVisibleCount((v) => v + PAGE_SIZE)
  }

  function deleteImage(id: string) {
    if (!confirm("Delete this image?")) return
    setAllImages((prev) => prev.filter((img) => img.id !== id))
  }

  function remixImage(image: ImageItem) {
    const remix: ImageItem = {
      id: crypto.randomUUID(),
      src: image.src,
      isVariation: true,
    }

    // Add remix to top
    setAllImages((prev) => [remix, ...prev])
  }

  function handleDownload() {
    alert("Upgrade required to download images")
  }

  // Infinite scroll
  useEffect(() => {
    function onScroll() {
      const nearBottom =
        window.innerHeight + window.scrollY >=
        document.body.offsetHeight - 300

      if (nearBottom) loadMore()
    }

    window.addEventListener("scroll", onScroll)
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  const images = allImages.slice(0, visibleCount)

  if (images.length === 0) {
    return (
      <div className="text-center text-zinc-400 mt-8">
        No images yet
      </div>
    )
  }

  return (
    <>
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

            {/* VARIATION BADGE */}
            {img.isVariation && (
              <div className="absolute top-1 left-1 bg-purple-600 text-white text-[10px] px-2 py-0.5 rounded">
                Remix
              </div>
            )}

            {/* WATERMARK */}
            {isFree && (
              <div className="absolute inset-0 flex items-center justify-center text-white text-xl font-bold opacity-70 pointer-events-none">
                Aiexor
              </div>
            )}

            {/* ACTIONS */}
            <div className="absolute bottom-1 right-1 flex gap-1">
              <button
                onClick={() => remixImage(img)}
                className="bg-blue-600 text-white text-xs px-2 py-1 rounded"
              >
                Remix
              </button>

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

      {/* LOADING */}
      {visibleCount < allImages.length && (
        <div className="text-center text-zinc-500 text-sm my-4">
          Loading more…
        </div>
      )}
    </>
  )
}
