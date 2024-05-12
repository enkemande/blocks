import * as schema from "@/database/schema";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";

const conn = neon(process.env.DRIZZLE_DATABASE_URL!);

export const db = drizzle(conn, {
  schema,
  logger: process.env.NODE_ENV === "development",
});
