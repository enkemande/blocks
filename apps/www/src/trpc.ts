import { db } from "@/database";
import { User, usersTable } from "@/database/schema";
import { authOptions } from "@/libs/auth";
import { initTRPC, TRPCError } from "@trpc/server";
import { eq } from "drizzle-orm";
import { getServerSession } from "next-auth";
import superjson from "superjson";
import { ZodError } from "zod";

export const createTRPCContext = async (opts: { headers: Headers }) => {
  let currentUser: User | null = null;
  const session = await getServerSession(authOptions);
  if (session?.user && session.user.email) {
    currentUser =
      (await db.query.usersTable.findFirst({
        where: eq(usersTable.email, session.user.email),
      })) ?? null;
  }
  return { db, session, currentUser, ...opts };
};

const t = initTRPC.context<typeof createTRPCContext>().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.cause instanceof ZodError ? error.cause.flatten() : null,
      },
    };
  },
});

export const createCallerFactory = t.createCallerFactory;
export const createTRPCRouter = t.router;
export const publicProcedure = t.procedure;

export const protectedProcedure = t.procedure.use(({ ctx, next }) => {
  if (!ctx.session || !ctx.session.user || !ctx.currentUser) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }
  return next({
    ctx: { session: { ...ctx.session, user: ctx.session.user } },
  });
});
