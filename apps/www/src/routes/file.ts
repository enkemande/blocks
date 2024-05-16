import { filesTable } from "@/database/schema";
import { AddFileSchema } from "@/schemas/file";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "@/trpc";
import { and, eq } from "drizzle-orm";
import { z } from "zod";

export const fileRouter = createTRPCRouter({
  add: protectedProcedure
    .input(AddFileSchema)
    .mutation(async ({ ctx, input }) => {
      return ctx.db
        .insert(filesTable)
        .values(input)
        .returning({ id: filesTable.id })
        .then((res) => res[0]);
    }),
  remove: protectedProcedure
    .input(z.number())
    .mutation(async ({ ctx, input }) => {
      return ctx.db
        .delete(filesTable)
        .where(eq(filesTable.id, input))
        .returning({ id: filesTable.id })
        .then((res) => res[0]);
    }),
  getAllForBlock: publicProcedure
    .input(z.number())
    .query(async ({ ctx, input }) => {
      return ctx.db
        .select()
        .from(filesTable)
        .where(eq(filesTable.blockId, input))
        .then((res) => res);
    }),
  getForBlockByFilename: publicProcedure
    .input(z.object({ filename: z.string(), blockId: z.number() }))
    .query(async ({ ctx, input: { filename, blockId } }) => {
      return ctx.db
        .select()
        .from(filesTable)
        .where(
          and(
            eq(filesTable.filename, filename),
            eq(filesTable.blockId, blockId),
          ),
        )
        .then((res) => res[0]);
    }),
});
