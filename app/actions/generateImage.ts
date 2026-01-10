"use server"

export async function generateImageAction(prompt: string) {
  if (!prompt || prompt.trim().length === 0) {
    throw new Error("Prompt is required")
  }

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_SITE_URL}/api/generate`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompt }),
      cache: "no-store",
    }
  )

  if (!res.ok) {
    const text = await res.text()
    throw new Error(text || "Image generation failed")
  }

  return res.json()
}
