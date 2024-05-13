import env from "@/config/env";
import fs from "fs";
import { readFile, writeFile } from "fs/promises";
import path from "path";
import zod from "zod";

const ext = ".json";
const dir = ".blocks";

const blockSchema = zod.object({
  name: zod.string(),
  version: zod.string().optional(),
  description: zod.string().optional(),
  path: zod.string(),
  framework: zod.string().optional(),
  uiLibrary: zod.string().optional(),
  modules: zod
    .array(
      zod.object({
        name: zod.string().optional(),
        path: zod.string().optional(),
        isBuiltIn: zod.boolean().optional(),
      }),
    )
    .optional(),
});

const blockConfigSchema = zod.object({
  $schema: zod.string().optional(),
  destination: zod.string(),
});

export type BlockSchemaType = zod.infer<typeof blockSchema>;
export type BlockConfigSchemaType = zod.infer<typeof blockConfigSchema>;

export const writeBlock = async (name: string, data: BlockSchemaType) => {
  const validatedData = await blockSchema.parseAsync(data);
  const blocksDir = path.resolve(process.cwd(), dir);
  if (!fs.existsSync(blocksDir)) fs.mkdirSync(blocksDir);
  const blockDir = path.resolve(blocksDir, name);
  return writeFile(blockDir + ext, JSON.stringify(validatedData, null, 2));
};

export const readBlock = async (name: string): Promise<BlockSchemaType> => {
  const blocksDir = path.resolve(process.cwd(), dir);
  const blockPath = path.resolve(blocksDir, name);
  const data = await readFile(blockPath + ext, "utf8");
  return JSON.parse(data);
};

export const writeBlockConfig = async (data: BlockConfigSchemaType) => {
  const validatedData = await blockConfigSchema.parseAsync(data);
  const blockConfigFile = path.resolve(process.cwd(), "blocks.json");
  return writeFile(
    blockConfigFile,
    JSON.stringify(
      {
        $schema: env.HOST + "/schema.json",
        ...validatedData,
      },
      null,
      2,
    ),
  );
};

export const getBlockConfig = async (): Promise<BlockConfigSchemaType> => {
  const blockConfigFile = path.resolve(process.cwd(), "blocks.json");
  const config = await readFile(blockConfigFile, "utf8");
  return JSON.parse(config);
};
