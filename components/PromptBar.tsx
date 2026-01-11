"use client"

import { useState } from "react"

export default function PromptBar({
  onGenerate,
}: {
  onGenerate: (prompt: string) => void
}) {
  const [prompt, setPrompt] = useState("")

  return (
    <div className="fixed bottom-0 left-0 right-0 p-4 bg-[#0b1416]/90 backdrop-blur z-40">
      <div className="max-w-3xl mx-auto flex gap-2">
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          rows={1}
          placeholder="Describe the image you want to generate…"
          className="
            flex-1 resize-none rounded-2xl
            bg-[#0e1b1f]
            px-4 py-3
            text-white placeholder-gray-400
            border border-teal-500/30
            focus:outline-none
            focus:ring-2 focus:ring-teal-400/40
            shadow-[0_0_12px_rgba(45,212,191,0.25)]
          "
        />

        <button
          onClick={() => onGenerate(prompt)}
          className="
            rounded-xl bg-teal-500 text-black px-4 py-3
            shadow-[0_0_15px_rgba(45,212,191,0.6)]
            hover:bg-teal-400 transition
          "
        >
          Generate
        </button>
      </div>
    </div>
  )
}
