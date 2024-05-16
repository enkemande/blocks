import { z } from "zod";

export const AddFileSchema = z
  .object({
    blockId: z.number(),
    downloadUrl: z.string(),
    path: z.string(),
    filename: z.string(),
    size: z.number(),
    type: z.string(),
  })
  .strict();
