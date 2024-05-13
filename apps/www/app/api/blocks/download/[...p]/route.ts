import AdmZip from "adm-zip";
import fs from "fs";
import { readFile } from "fs/promises";
import { NextRequest, NextResponse } from "next/server";
import path from "path";

export const GET = async (
  _: NextRequest,
  context: { params: { p: string[] } },
) => {
  try {
    const headers = new Headers();
    const filePath = path.resolve(
      process.env.REGISTRY_STORAGE as string,
      ...context.params.p,
    );
    if (!fs.existsSync(filePath)) throw new Error("File not found");
    const stats = fs.statSync(filePath);
    if (stats.isDirectory()) {
      const folderPathArr = filePath.split("/");
      const folderName = folderPathArr[folderPathArr.length - 1];
      const zip = new AdmZip();
      zip.addLocalFolder(filePath);
      const zipStream = zip.toBuffer();
      headers.append(
        "Content-Disposition",
        `attachment; filename="${folderName}.zip"`,
      );
      headers.append("Content-Type", "application/zip");
      return new NextResponse(zipStream, { headers });
    } else {
      const fileName = path.basename(filePath);
      const buffer = await readFile(filePath, "utf-8");
      headers.append(
        "Content-Disposition",
        `attachment; filename="${fileName}"`,
      );
      headers.append("Content-Type", "application/pdf");
      return new NextResponse(buffer, { headers });
    }
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ errorMessage: error.message });
    }
  }
};
