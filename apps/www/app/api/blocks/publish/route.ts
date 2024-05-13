import { db } from "@/database";
import { blocks, files, modules } from "@/database/schema";
import { extractModules } from "@/utils/extract-modules";
import { faker } from "@faker-js/faker";
import fs from "fs";
import { NextRequest, NextResponse } from "next/server";
import path from "path";
import { pipeline } from "stream";
import { promisify } from "util";

const pump = promisify(pipeline);

export const POST = async (request: NextRequest) => {
  try {
    const registryPath = path.resolve(process.cwd(), "registry");
    if (!fs.existsSync(registryPath)) fs.mkdirSync(registryPath);

    const ownerName = faker.internet.userName();
    const ownerPath = path.resolve(registryPath, ownerName);
    if (!fs.existsSync(ownerPath)) fs.mkdirSync(ownerPath);

    const formData = await request.formData();
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const formEntries = Array.from(formData.entries());
    const fileList = formEntries.filter(([, value]) => value instanceof File);

    const [savedBlock] = await db
      .insert(blocks)
      .values({ name: `${ownerName}/${name}`, description })
      .returning({ id: blocks.id, name: blocks.name });

    const blockPath = path.resolve(registryPath, savedBlock.name);
    if (!fs.existsSync(blockPath)) fs.mkdirSync(blockPath);

    const savedFiles = await Promise.all(
      fileList.map(async ([key, value]) => {
        const file = value as File;
        const filePath = path.resolve(blockPath, key);
        const relativeFilePath = path.relative(process.cwd(), filePath);
        const directoryPath = path.dirname(filePath);
        if (!fs.existsSync(directoryPath)) fs.mkdirSync(directoryPath);
        const stream = file.stream() as unknown as NodeJS.ReadableStream;
        const arrayBuffer = await file.arrayBuffer();
        const arrayBufferToString = Buffer.from(arrayBuffer).toString();
        const moduleList = extractModules(arrayBufferToString);

        const [saveFile] = await db
          .insert(files)
          .values({
            blockId: savedBlock.id,
            path: relativeFilePath,
            filename: file.name,
            size: file.size,
            type: file.type,
          })
          .returning({ id: files.id });

        await Promise.all(
          moduleList.map(async (name) => {
            return db
              .insert(modules)
              .values({ name, fileId: saveFile.id })
              .returning({ id: modules.id });
          }),
        );
        await pump(stream, fs.createWriteStream(filePath));
        return saveFile;
      }),
    );
    return NextResponse.json(
      { message: "success", data: savedFiles },
      { status: 200 },
    );
  } catch (error) {
    console.log("error", error);
    if (error instanceof Error) {
      return NextResponse.json({ message: error.message }, { status: 500 });
    }
  }
};
