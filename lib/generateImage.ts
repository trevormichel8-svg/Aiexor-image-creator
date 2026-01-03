import OpenAI from "openai"
import { requireOpenAIKey } from "@/lib/env"

const client = new OpenAI({
  apiKey: requireOpenAIKey(),
})

export async function generateImage(prompt: string): Promise<string> {
  const result = await client.images.generate({
    model: "gpt-image-1",
    prompt,
    size: "1024x1024",
  })

  const imageBase64 = result.data[0]?.b64_json

  if (!imageBase64) {
    throw new Error("No image returned from OpenAI")
  }

  return `data:image/png;base64,${imageBase64}`
}
