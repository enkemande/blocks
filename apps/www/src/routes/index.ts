import { blockRouter } from "@/routes/block";
import { fileRouter } from "@/routes/file";
import { moduleRouter } from "@/routes/module";
import { createCallerFactory, createTRPCRouter } from "@/trpc";

export const appRouter = createTRPCRouter({
  block: blockRouter,
  file: fileRouter,
  module: moduleRouter,
});

export type AppRouter = typeof appRouter;
export const createCaller = createCallerFactory(appRouter);
