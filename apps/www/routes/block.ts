import { blocks } from "@/database/schema";
import { createTRPCRouter, publicProcedure } from "@/trpc";
import { eq } from "drizzle-orm";
import { z } from "zod";

export const blockRouter = createTRPCRouter({
  get: publicProcedure.input(z.string()).query(({ ctx, input }) => {
    return ctx.db.query.blocks.findFirst({
      with: { files: { with: { modules: true } } },
      where: eq(blocks.name, input),
    });
  }),
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.db.query.blocks.findMany({});
  }),
});
