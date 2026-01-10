"use client"

import { useEffect, useState } from "react"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function Gallery({ userId }: { userId: string }) {
  const [images, setImages] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [activeImage, setActiveImage] = useState<any | null>(null)

  useEffect(() => {
    loadImages()
  }, [])

  async function loadImages() {
    const { data } = await supabase
      .from("image_generations")
      .select("id, image_url, created_at, plan")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(30)

    setImages(data ?? [])
    setLoading(false)
  }

  function FullscreenViewer() {
    if (!activeImage) return null

    return (
      <div className="fixed inset-0 bg-black z-50 flex flex-col">
        {/* HEADER */}
        <div className="p-3 flex justify-between items-center">
          <div className="text-sm text-gray-300">
            {activeImage.plan === "free" ? "Free Preview" : "Full Quality"}
          </div>

          <button
            onClick={() => setActiveImage(null)}
            className="text-white text-xl"
          >
            ✕
          </button>
        </div>

        {/* IMAGE */}
        <div className="flex-1 flex items-center justify-center p-2">
          <img
            src={activeImage.image_url}
            alt="Full view"
            className="max-h-full max-w-full rounded"
          />
        </div>

        {/* FOOTER */}
        <div className="p-3 text-center text-xs text-gray-400">
          Long-press to save image
        </div>
      </div>
    )
  }

  if (loading) {
    return <p className="text-sm text-gray-400 mt-4">Loading gallery…</p>
  }

  if (!images.length) {
    return (
      <p className="text-sm text-gray-400 mt-4">
        No images yet. Generate your first one!
      </p>
    )
  }

  return (
    <>
      <FullscreenViewer />

      <div className="mt-8">
        <h2 className="text-sm font-semibold mb-3 text-gray-300">
          Your Images
        </h2>

        <div className="grid grid-cols-2 gap-2">
          {images.map((img) => (
            <button
              key={img.id}
              onClick={() => setActiveImage(img)}
              className="relative border border-zinc-700 rounded overflow-hidden"
            >
              <img
                src={img.image_url}
                alt="Generated"
                className="w-full h-full object-cover"
              />

              {img.plan === "free" && (
                <div className="absolute bottom-1 right-1 text-[10px] bg-black/60 px-1 rounded">
                  Free
                </div>
              )}
            </button>
          ))}
        </div>
      </div>
    </>
  )
}
