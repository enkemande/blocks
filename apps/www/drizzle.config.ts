import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./database/schema.ts",
  out: "./database/migrations",
  // @ts-ignore
  dialect: "postgresql",
  driver: "pg",
  dbCredentials: {
    host: process.env.PGHOST as string,
    database: process.env.PGDATABASE as string,
    password: process.env.PGPASSWORD as string,
    user: process.env.PGUSER as string,
    ssl: true,
  },
  migration: {
    table: "migrations",
    schema: "public",
  },
});
