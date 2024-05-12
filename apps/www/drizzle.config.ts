import "dotenv/config";
import { type Config } from "drizzle-kit";

export default {
  schema: "./database/schema.ts",
  out: "./database/migrations",
  driver: "pg",
  dbCredentials: {
    connectionString: process.env.DRIZZLE_DATABASE_URL as string,
  },
} satisfies Config;
