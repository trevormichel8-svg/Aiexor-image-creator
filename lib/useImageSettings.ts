"use client"

import { useState } from "react"
import artStyles from "./artStyles"

export function useImageSettings() {
  // Default the art style to the first entry in our art styles list. This ensures
  // the default selection is a valid option rather than an arbitrary hard
  // coded string that may not exist in the list. Falling back to a generic
  // "Art Style" if the list is empty makes the UI predictable.
  const [artStyle, setArtStyle] = useState(
    artStyles[0] ?? "Art Style"
  )
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
