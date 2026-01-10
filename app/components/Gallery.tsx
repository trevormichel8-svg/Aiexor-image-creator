"use client"

import { useEffect, useState } from "react"

type ImageItem = {
  id: string
  url: string
}

export default function Gallery({ isFree }: { isFree: boolean }) {
  const [images, setImages] = useState<ImageItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // mock data placeholder – replace with real fetch if needed
    setImages([
      { id: "1", url: "/generated" },
      { id: "2", url: "/generated" },
      { id: "3", url: "/generated" },
      { id: "4", url: "/generated" },
      { id: "5", url: "/generated" },
    ])
    setLoading(false)
  }, [])

  if (loading) {
    return <p className="text-center text-zinc-500">Loading images…</p>
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-4xl mx-auto">
      {images.map((img) => (
        <div
          key={img.id}
          className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden"
        >
          {/* IMAGE */}
          <div className="relative">
            <img
              src={img.url}
              alt="Generated"
              className="w-full aspect-square object-cover"
            />

            {isFree && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/50 text-sm font-medium">
                Aiexor
              </div>
            )}
          </div>

          {/* ACTIONS */}
          <div className="flex justify-between items-center px-3 py-2 text-xs text-zinc-400">
            <button className="hover:text-white">Remix</button>

            {isFree ? (
              <button className="text-teal-400 hover:text-teal-300">
                Upgrade
              </button>
            ) : (
              <button className="hover:text-white">Download</button>
            )}

            <button className="hover:text-red-400">Delete</button>
          </div>
        </div>
      ))}
    </div>
  )
}
