import { createTRPCRouter, protectedProcedure } from "@/trpc";
import { z } from "zod";

export const userRouter = createTRPCRouter({
  create: protectedProcedure
    .input(z.object({}))
    .mutation(async ({ ctx, input }) => {}),
});
