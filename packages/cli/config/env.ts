import dotenv from "dotenv";
import zod from "zod";

dotenv.config();

const envSchema = zod.object({
  NODE_ENV: zod.string().default("development"),
  PORT: zod.string().default("3000"),
  HOST: zod.string().default("http://localhost:3000"),
  DOWNLOAD_ENDPOINT: zod.string().default("http://localhost:3000/api"),
  PUBLISH_ENDPOINT: zod.string().default("http://localhost:3000/api/blocks"),
});

export default envSchema.parse(process.env);
