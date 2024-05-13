import { db } from "@/database";
import { files, modules } from "@/database/schema";
import { trpcCaller } from "@/libs/trpc/server";
import { extractModules } from "@/utils/extract-modules";
import { faker } from "@faker-js/faker";
import { put } from "@vercel/blob";
import { NextRequest, NextResponse } from "next/server";
import { z, ZodError } from "zod";

const publishBlockSchema = z.object({
  name: z.string(),
  description: z.string(),
});

export const POST = async (request: NextRequest) => {
  try {
    const ownerName = faker.internet.userName();
    const formData = await request.formData();

    const { name, description } = publishBlockSchema.parse({
      name: formData.get("name"),
      description: formData.get("description"),
    });

    const formEntries = Array.from(formData.entries());
    const fileList = formEntries.filter(([, value]) => value instanceof File);

    const block = await trpcCaller.block.create({
      name: `${ownerName}/${name}`,
      description,
    });

    await Promise.all(
      fileList.map(async ([dirPath, value]) => {
        const file = value as File;
        const arrayBuffer = await file.arrayBuffer();
        const arrayBufferToString = Buffer.from(arrayBuffer).toString();
        const { downloadUrl } = await put(file.name, file, {
          access: "public",
        });

        const moduleList = extractModules(arrayBufferToString);
        const [saveFile] = await db
          .insert(files)
          .values({
            blockId: block.id,
            downloadUrl: downloadUrl,
            path: dirPath,
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
      }),
    );
    return NextResponse.json({ message: "success" }, { status: 200 });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json({ message: error.message }, { status: 403 });
    } else {
      return NextResponse.json(
        { message: "An unknown error occurred" },
        { status: 500 },
      );
    }
  }
};
