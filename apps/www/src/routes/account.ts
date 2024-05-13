import { createTRPCRouter, protectedProcedure } from "@/trpc";
import { z } from "zod";

export const accountRouter = createTRPCRouter({
  create: protectedProcedure
    .input(z.object({}))
    .mutation(async ({ ctx, input }) => {}),
});
