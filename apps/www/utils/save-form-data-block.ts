import fs from "fs";
import path from "path";
import { pipeline } from "stream";

export const saveFormDataBlock = async (formData: FormData, name: string) => {
  const files = Array.from(formData.entries()).filter(
    ([, value]) => value instanceof File,
  );
  await Promise.all(
    files.map(async ([key, value]) => {
      const file = value as File;
      const filePath = path.join("registry", name, key);
      const directoryPath = path.dirname(filePath);
      if (!fs.existsSync(directoryPath)) fs.mkdirSync(directoryPath);
      await new Promise((resolve, reject) => {
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
      });
    }),
  );
};
