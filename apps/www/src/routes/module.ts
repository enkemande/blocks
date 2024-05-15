import { modulesTable } from "@/database/schema";
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
        .insert(modulesTable)
        .values(input)
        .returning({ id: modulesTable.id })
        .then((res) => res[0]);
    }),
});
