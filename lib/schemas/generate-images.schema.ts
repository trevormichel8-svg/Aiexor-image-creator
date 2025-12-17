import { z } from "zod";

export const GenerateImagesSchema = z.object({
  prompt: z.string().min(3),
  model: z.string().optional(),
});
