import { db } from "@/database";
import * as schema from "@/database/schema";
import env from "@/utils/env";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { type AuthOptions } from "next-auth";
import { type Adapter } from "next-auth/adapters";
import GitHubProvider from "next-auth/providers/github";

export const authOptions: AuthOptions = {
  secret: env.NEXTAUTH_SECRET,
  adapter: <Adapter>DrizzleAdapter(db, {
    accountsTable: schema.accountsTable,
    usersTable: schema.usersTable,
    sessionsTable: schema.sessionsTable,
    verificationTokensTable: schema.verificationTokensTable,
  }),
  providers: [
    GitHubProvider({
      clientId: env.GITHUB_CLIENT_ID,
      clientSecret: env.GITHUB_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    redirect({ url }) {
      return url;
    },
    session({ session, user }) {
      session.user = user as schema.User;
      return session;
    },
  },
};
