import * as schema from "@/database/schema";
import { sql } from "@vercel/postgres";
import { drizzle } from "drizzle-orm/vercel-postgres";

export const db = drizzle(sql, {
  schema,
  logger: process.env.NODE_ENV === "development",
});
