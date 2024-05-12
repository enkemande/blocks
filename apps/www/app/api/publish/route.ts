import { db } from "@/database";
import { blocks, files, modules } from "@/database/schema";
import fs from "fs";
import { NextRequest, NextResponse } from "next/server";
import path from "path";
import { pipeline } from "stream";
import { promisify } from "util";
import { z } from "zod";

const pump = promisify(pipeline);

const publishPayloadValidationSchema = z.object({
  name: z.string(),
  description: z.string(),
  modules: z.string(),
});

export const POST = async (request: NextRequest) => {
  try {
    const registryStoragePath = path.resolve(
      process.cwd(),
      process.env.REGISTRY_STORAGE as string,
    );

    const formData = await request.formData();
    const {
      name,
      description,
      modules: moduleList,
    } = publishPayloadValidationSchema.parse({
      name: formData.get("name"),
      description: formData.get("description"),
      modules: formData.get("modules"),
    });

    const fileList = Array.from(formData.entries()).filter(
      ([, value]) => value instanceof File,
    );

    if (!fs.existsSync(registryStoragePath)) fs.mkdirSync(registryStoragePath);
    const blockPath = path.join(registryStoragePath, name);
    if (!fs.existsSync(blockPath)) fs.mkdirSync(blockPath);

    const [block] = await db
      .insert(blocks)
      .values({
        name,
        description,
        path: path.relative(process.cwd(), blockPath),
      })
      .returning({ id: blocks.id });

    await Promise.all(
      fileList.map(async ([key, value]) => {
        const file = value as File;
        const filePath = path.join(blockPath, key);
        const directoryPath = path.dirname(filePath);
        if (!fs.existsSync(directoryPath)) fs.mkdirSync(directoryPath);
        await pump(
          file.stream() as unknown as NodeJS.ReadableStream,
          fs.createWriteStream(filePath),
        );
        const [savedFile] = await db
          .insert(files)
          .values({
            blockId: block.id,
            path: path.relative(process.cwd(), filePath),
            filename: file.name,
            size: file.size,
            type: file.type,
          })
          .returning({ id: files.id });
        const parsedModules = JSON.parse(moduleList);
        const fileModule = parsedModules.find((m: any) => m.path === key);
        await db
          .insert(modules)
          .values({ fileId: savedFile.id, ...fileModule });
      }),
    );
    return NextResponse.json({ status: "success" });
  } catch (e) {
    return NextResponse.json({ status: "fail", data: e });
  }
};
