import { blocks, users } from "@/database/schema";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "@/trpc";
import { and, eq } from "drizzle-orm";
import { z } from "zod";

export const blockRouter = createTRPCRouter({
  create: protectedProcedure
    .input(z.object({ name: z.string(), description: z.string() }))
    .mutation(async ({ ctx, input: { name } }) => {
      const user = await ctx.db.query.users.findFirst({
        where: eq(users.id, ctx.session.user.email!),
      });
      if (!user) throw new Error("User not found");
      return ctx.db
        .insert(blocks)
        .values({ name, ownerId: user.id })
        .returning({ id: blocks.id })
        .then((result) => result[0]);
    }),
  get: publicProcedure
    .input(z.object({ owner: z.string(), block: z.string() }))
    .query(async ({ ctx, input: { owner, block } }) => {
      return ctx.db.query.blocks.findFirst({
        with: { files: { with: { modules: true } } },
        where: and(eq(blocks.name, block)),
      });
    }),
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.db.query.blocks.findMany({});
  }),
});
