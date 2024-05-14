import { loadEnvConfig } from "@next/env";
import { z } from "zod";

loadEnvConfig(process.cwd());

export const envSchema = z.object({
  POSTGRES_DATABASE: z.string(),
  POSTGRES_HOST: z.string(),
  POSTGRES_PASSWORD: z.string(),
  POSTGRES_PRISMA_URL: z.string(),
  POSTGRES_URL: z.string(),
  POSTGRES_URL_NON_POOLING: z.string(),
  POSTGRES_URL_NO_SSL: z.string(),
  POSTGRES_USER: z.string(),
  TURBO_REMOTE_ONLY: z.string(),
  TURBO_RUN_SUMMARY: z.string(),
  VERCEL: z.string(),
  VERCEL_ENV: z.string(),
  VERCEL_GIT_COMMIT_AUTHOR_LOGIN: z.string(),
  VERCEL_GIT_COMMIT_AUTHOR_NAME: z.string(),
  VERCEL_GIT_COMMIT_MESSAGE: z.string(),
  VERCEL_GIT_COMMIT_REF: z.string(),
  VERCEL_GIT_COMMIT_SHA: z.string(),
  VERCEL_GIT_PREVIOUS_SHA: z.string(),
  VERCEL_GIT_PROVIDER: z.string(),
  VERCEL_GIT_PULL_REQUEST_ID: z.string(),
  VERCEL_GIT_REPO_ID: z.string(),
  VERCEL_GIT_REPO_OWNER: z.string(),
  VERCEL_GIT_REPO_SLUG: z.string(),
  VERCEL_URL: z.string(),
  GITHUB_CLIENT_ID: z.string(),
  GITHUB_CLIENT_SECRET: z.string(),
  NEXTAUTH_SECRET: z.string(),
});

export default envSchema.parse(process.env);
