import { files } from "@/database/schema";
import { createTRPCRouter, protectedProcedure } from "@/trpc";
import { z } from "zod";

export const fileRouter = createTRPCRouter({
  add: protectedProcedure
    .input(
      z.object({
        blockId: z.number(),
        downloadUrl: z.string(),
        path: z.string(),
        filename: z.string(),
        size: z.number(),
        type: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db
        .insert(files)
        .values(input)
        .returning({ id: files.id })
        .then((res) => res[0]);
    }),
});
