import { z } from "zod"

export const imageRequestSchema = z.object({
  prompt: z.string().min(5).max(500),
  style: z.string().min(1).max(50),
  // Accept a strength value between 0 and 100. Although the UI sends values in
  // that range, we clamp here to avoid invalid input passing through.
  strength: z.number().min(0).max(100),
})
