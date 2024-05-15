import { z } from "zod";

export const CreateBlockSchema = z
  .object({
    name: z
      .string()
      .min(1, "block name should be at least 1 character long")
      .refine((s) => !s.includes(" "), "No Spaces!"),
    description: z
      .string()
      .min(1, "block description should be at least 1 character long"),
    framework: z.string().default("react"),
    library: z.string().default("shadcn"),
    visibility: z.string().default("public"),
  })
  .strict();

export const UpdateBlockSchema = z.object({
  id: z.number(),
  name: z.string().min(1, "block name should be at least 1 character long"),
  description: z
    .string()
    .min(1, "block description should be at least 1 character long"),
  visibility: z.string().default("public"),
});

export const GetBlockSchema = z.object({
  userId: z.string(),
  name: z.string(),
});
