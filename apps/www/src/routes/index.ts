import { blockRouter } from "@/routes/block";
import { fileRouter } from "@/routes/file";
import { moduleRouter } from "@/routes/module";
import { userRouter } from "@/routes/user";
import { createCallerFactory, createTRPCRouter } from "@/trpc";

export const appRouter = createTRPCRouter({
  block: blockRouter,
  file: fileRouter,
  module: moduleRouter,
  user: userRouter,
});

export type AppRouter = typeof appRouter;
export const createCaller = createCallerFactory(appRouter);
