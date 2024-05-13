import { blockRouter } from "@/routes/block";
import { createCallerFactory, createTRPCRouter } from "@/trpc";

export const appRouter = createTRPCRouter({
  block: blockRouter,
});

export type AppRouter = typeof appRouter;
export const createCaller = createCallerFactory(appRouter);
