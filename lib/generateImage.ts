import OpenAI from "openai"
import { requireOpenAIKey } from "./env"

const client = new OpenAI({
  apiKey: requireOpenAIKey(),
})

export async function generateImage(prompt: string) {
  const result = await client.images.generate({
    model: "gpt-image-1",
    prompt,
    size: "1024x1024",
  })

  return result.data[0].url!
}
