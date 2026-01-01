"use client"

import { useState } from "react"

export function useImageSettings() {
  const [artStyle, setArtStyle] = useState("Realistic")
  const [strength, setStrength] = useState(70)
  const [prompt, setPrompt] = useState("")

  return {
    artStyle,
    setArtStyle,
    strength,
    setStrength,
    prompt,
    setPrompt,
  }
}
