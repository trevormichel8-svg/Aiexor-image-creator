"use client"

import { useEffect, useState } from "react"
import PromptBar from "@/components/PromptBar"
import AuthButton from "@/components/AuthButton"
import ImageCanvas from "@/components/ImageCanvas"
import { supabase } from "@/lib/supabaseClient"

export default function Page() {
  const [user, setUser] = useState<any>(null)
  const [image, setImage] = useState<string | null>(null)
  const [credits, setCredits] = useState<number>(200) // TEMP

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user)
    })
  }, [])

  async function generate(prompt: string) {
    const res = await fetch("/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt }),
    })

    const data = await res.json()
    if (data.imageUrl) setImage(data.imageUrl)
  }

  return (
    <main className="min-h-screen pb-28">
      {/* Top Right Auth */}
      <div className="fixed top-4 right-4 z-50">
        <AuthButton />
      </div>

      {/* Credits */}
      {user && (
        <div className="fixed top-4 left-4 text-teal-400">
          Credits: {credits}
        </div>
      )}

      {/* Image */}
      <div className="flex justify-center mt-24 px-4">
        {image ? <ImageCanvas src={image} /> : <p>Generate an image</p>}
      </div>

      {/* Prompt */}
      <PromptBar onGenerate={generate} />
    </main>
  )
}
