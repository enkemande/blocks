import { blocks } from "@/database/schema";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "@/trpc";
import { and, eq } from "drizzle-orm";
import { z } from "zod";

export const blockRouter = createTRPCRouter({
  save: protectedProcedure
    .input(z.object({ name: z.string(), description: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db
        .insert(blocks)
        .values({ ...input, ownerId: ctx.currentUser?.id! })
        .returning({ id: blocks.id })
        .then((result) => result[0]);
    }),
  get: publicProcedure
    .input(z.object({ ownerUsername: z.string(), name: z.string() }))
    .query(async ({ ctx, input: { ownerUsername, name } }) => {
      return ctx.db.query.blocks.findFirst({
        with: { files: { with: { modules: true } } },
        where: and(eq(blocks.name, name)),
      });
    }),
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.db.query.blocks.findMany({});
  }),
});
