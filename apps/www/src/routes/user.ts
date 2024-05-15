import { usersTable } from "@/database/schema";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "@/trpc";
import { eq, or } from "drizzle-orm";
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
    return ctx.db.query.usersTable.findFirst({
      where: eq(usersTable.username, input),
      with: { sessions: true, accounts: true },
    });
  }),
  getByEmail: publicProcedure.input(z.string()).query(({ ctx, input }) => {
    return ctx.db.query.usersTable.findFirst({
      where: eq(usersTable.email, input),
      with: { sessions: true, accounts: true },
    });
  }),
  getById: publicProcedure.input(z.string()).query(({ ctx, input }) => {
    return ctx.db.query.usersTable.findFirst({
      where: eq(usersTable.id, input),
      with: { sessions: true, accounts: true },
    });
  }),
  getByIdOrUsername: publicProcedure
    .input(z.string())
    .query(({ ctx, input }) => {
      return ctx.db.query.usersTable.findFirst({
        where: or(eq(usersTable.username, input), eq(usersTable.id, input)),
        with: { sessions: true, accounts: true },
      });
    }),
});
