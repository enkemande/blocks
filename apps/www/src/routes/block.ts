import { blocksTable } from "@/database/schema";
import {
  CreateBlockSchema,
  GetBlockSchema,
  UpdateBlockSchema,
} from "@/schemas/block";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "@/trpc";
import { and, eq } from "drizzle-orm";
import { z } from "zod";

export const blockRouter = createTRPCRouter({
  create: protectedProcedure
    .input(CreateBlockSchema)
    .mutation(async ({ ctx, input }) => {
      return ctx.db
        .insert(blocksTable)
        .values({ ...input, ownerId: ctx.session.user?.id! })
        .returning()
        .then((result) => result[0]);
    }),
  update: protectedProcedure
    .input(UpdateBlockSchema)
    .mutation(async ({ ctx, input: { id, ...restOfInput } }) => {
      return ctx.db
        .update(blocksTable)
        .set(restOfInput)
        .where(eq(blocksTable.id, id))
        .returning({ id: blocksTable.id })
        .then((result) => result[0]);
    }),
  delete: protectedProcedure
    .input(z.number())
    .mutation(async ({ ctx, input }) => {
      return ctx.db
        .delete(blocksTable)
        .where(eq(blocksTable.id, input))
        .returning({ id: blocksTable.id })
        .then((result) => result[0]);
    }),
  getAllForUser: publicProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      return ctx.db.query.blocksTable.findMany({
        where: eq(blocksTable.ownerId, input),
      });
    }),
  get: publicProcedure
    .input(GetBlockSchema)
    .query(async ({ ctx, input: { userId, name } }) => {
      return ctx.db.query.blocksTable.findFirst({
        with: { files: { with: { modules: true } }, user: true },
        where: and(eq(blocksTable.name, name), eq(blocksTable.ownerId, userId)),
      });
    }),
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.db.query.blocksTable.findMany({ with: { user: true } });
  }),
});
