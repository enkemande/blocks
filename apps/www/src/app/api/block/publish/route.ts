import { trpcCaller } from "@/libs/trpc/server";
import { extractModulesFromFile } from "@/utils/extract-modules";
import { put } from "@vercel/blob";
import { NextRequest, NextResponse } from "next/server";
import { z, ZodError } from "zod";

const publishBlockSchema = z.object({
  name: z.string(),
  description: z.string(),
});

export const POST = async (request: NextRequest) => {
  try {
    const formData = await request.formData();

    const validateValues = publishBlockSchema.parse({
      name: formData.get("name"),
      description: formData.get("description"),
    });

    const files = Array.from(formData.entries()).filter(([, value]) => {
      return value instanceof File;
    });

    const block = await trpcCaller.block.create({
      ...validateValues,
      framework: "react",
      library: "shadcn",
      visibility: "public",
    });

    await Promise.all(
      files.map(async ([dirPath, value]) => {
        const file = value as File;
        const blob = await put(file.name, file, { access: "public" });

        const fileData = await trpcCaller.file.add({
          blockId: block.id,
          downloadUrl: blob.downloadUrl,
          path: dirPath,
          filename: file.name,
          size: file.size,
          type: file.type,
        });

        const modules = await extractModulesFromFile(file);

        await Promise.all(
          modules.map((module) => {
            return trpcCaller.module.save({
              name: module,
              fileId: fileData.id,
            });
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
