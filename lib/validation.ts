import { z } from "zod"

export const imageRequestSchema = z.object({
  prompt: z.string().min(5).max(500),
  style: z.string().min(1).max(50),
})
