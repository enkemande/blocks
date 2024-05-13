import { loadEnvConfig } from "@next/env";
import { z } from "zod";

loadEnvConfig(process.cwd());

export const envSchema = z.object({
  REGISTRY_STORAGE: z.string(),
  POSTGRES_URL: z.string(),
  GITHUB_ID: z.string(),
  GITHUB_SECRET: z.string(),
  DATABASE_NAME: z.string(),
});

export default envSchema.parse(process.env);
