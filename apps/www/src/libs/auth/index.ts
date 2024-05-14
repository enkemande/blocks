import { db } from "@/database";
import env from "@/utils/env";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { type AuthOptions } from "next-auth";
import { Adapter } from "next-auth/adapters";
import GitHubProvider from "next-auth/providers/github";

export const authOptions = {
  adapter: DrizzleAdapter(db) as Adapter,
  secret: env.NEXTAUTH_SECRET,
  providers: [
    GitHubProvider({
      clientId: env.GITHUB_CLIENT_ID,
      clientSecret: env.GITHUB_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      console.log("signIn", { user, account, profile, email, credentials });
      return true;
    },
    async redirect({ url }) {
      return url;
    },
    async jwt({ token, user, account, profile }) {
      return token;
    },
    async session({ session, user, token }) {
      return session;
    },
  },
} as AuthOptions;
