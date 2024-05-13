import { db } from "@/database";
import env from "@/utils/env";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { type AuthOptions } from "next-auth";
import { Adapter } from "next-auth/adapters";
import GitHubProvider from "next-auth/providers/github";

export const authOptions = {
  adapter: DrizzleAdapter(db) as Adapter,
  providers: [
    GitHubProvider({
      clientId: env.GITHUB_CLIENT_ID,
      clientSecret: env.GITHUB_CLIENT_SECRET,
    }),
  ],
} as AuthOptions;
