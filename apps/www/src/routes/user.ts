import { usersTable } from "@/database/schema";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "@/trpc";
import { eq } from "drizzle-orm";
import { z } from "zod";

export const userRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        email: z.string(),
        username: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.insert(usersTable).values({ ...input });
    }),
  getByUsername: publicProcedure.input(z.string()).query(({ ctx, input }) => {
    // return ctx.db.query.usersTable.findFirst({ where: eq(usersTable.username, input) });
    return {};
  }),
  getByEmail: publicProcedure.input(z.string()).query(({ ctx, input }) => {
    return ctx.db.query.usersTable.findFirst({
      where: eq(usersTable.email, input),
    });
  }),
  getById: publicProcedure.input(z.string()).query(({ ctx, input }) => {
    return ctx.db.query.usersTable.findFirst({
      where: eq(usersTable.id, input),
    });
  }),
});
