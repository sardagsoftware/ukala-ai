import { z } from "zod";
export const generateSchema = z.object({
  title: z.string().min(2).max(200),
  prompt: z.string().min(10).max(2000),
  targetDurationSec: z.number().int().min(10).max(1200).default(60), // 10s - 20dk
});
export type GenerateInput = z.infer<typeof generateSchema>;