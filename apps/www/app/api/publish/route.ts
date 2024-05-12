import fs from "fs";
import { NextRequest, NextResponse } from "next/server";
import path from "path";
import { pipeline } from "stream";

export const POST = async (request: NextRequest) => {
  try {
    const formData = await request.formData();
    const name = formData.get("name") as string;
    await new Promise((resolve, reject) => {
      formData.forEach(async (value, key) => {
        if (typeof value === "object") {
          const file = value as File;
          const filePath = path.join("registry", name, key);
          const directoryPath = path.dirname(filePath);
          if (!fs.existsSync(directoryPath)) fs.mkdirSync(directoryPath);
          pipeline(
            file.stream() as unknown as NodeJS.ReadableStream,
            fs.createWriteStream(filePath),
            (error) => {
              if (error) {
                reject(error);
              }
              resolve(true);
            },
          );
        }
      });
    });
    return NextResponse.json({ status: "success" });
  } catch (e) {
    return NextResponse.json({ status: "fail", data: e });
  }
};
