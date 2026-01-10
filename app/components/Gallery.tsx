"use client"

import { useEffect, useState } from "react"

type ImageItem = {
  id: string
  src: string
}

const PAGE_SIZE = 6

export default function Gallery({ isFree }: { isFree: boolean }) {
  const [allImages, setAllImages] = useState<ImageItem[]>([])
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE)

  // Mock images (replace later with real generated images)
  useEffect(() => {
    const generated = Array.from({ length: 40 }).map((_, i) => ({
      id: `${i}`,
      src: `/placeholder${(i % 3) + 1}.png`,
    }))
    setAllImages(generated)
  }, [])

  function loadMore() {
    setVisibleCount((v) => v + PAGE_SIZE)
  }

  function deleteImage(id: string) {
    const confirmDelete = confirm("Delete this image?")
    if (!confirmDelete) return

    setAllImages((prev) => prev.filter((img) => img.id !== id))
  }

  function handleDownload() {
    alert("Upgrade required to download images")
  }

  // Infinite scroll trigger
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

            {/* WATERMARK */}
            {isFree && (
              <div className="absolute inset-0 flex items-center justify-center text-white text-xl font-bold opacity-70 pointer-events-none">
                Aiexor
              </div>
            )}

            {/* ACTIONS */}
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

      {/* LOADING INDICATOR */}
      {visibleCount < allImages.length && (
        <div className="text-center text-zinc-500 text-sm my-4">
          Loading more…
        </div>
      )}
    </>
  )
}
