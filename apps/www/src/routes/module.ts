import { modules } from "@/database/schema";
import { createTRPCRouter, protectedProcedure } from "@/trpc";
import { z } from "zod";

export const moduleRouter = createTRPCRouter({
  save: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        fileId: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db
        .insert(modules)
        .values(input)
        .returning({ id: modules.id })
        .then((res) => res[0]);
    }),
});
