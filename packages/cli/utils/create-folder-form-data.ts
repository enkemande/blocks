import FormData from "form-data";
import fs from "fs";
import path from "path";

export const createFolderFormData = (
  folderPath: string,
  formData: FormData,
  rootDir = folderPath
) => {
  const files = fs.readdirSync(folderPath);
  files.forEach((file) => {
    const filePath = path.join(folderPath, file);
    const relativePath = path.relative(rootDir, filePath);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      createFolderFormData(filePath, formData, rootDir);
    } else {
      formData.append(relativePath, fs.createReadStream(filePath));
    }
  });
};
