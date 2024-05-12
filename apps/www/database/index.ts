import * as schema from "@/database/schema";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";

const conn = neon(process.env.NEON_DATABASE_URL as string);

export const db = drizzle(conn, {
  schema,
  logger: process.env.NODE_ENV === "development",
});
