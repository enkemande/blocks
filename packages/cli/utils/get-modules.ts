import fs from "fs";
import { isBuiltin } from "module";
import path from "path";
import zod from "zod";

export const moduleSchemas = zod.object({
  name: zod.string().optional(),
  path: zod.string().optional(),
  isBuiltIn: zod.boolean().optional(),
});

export type ModuleSchemaType = zod.infer<typeof moduleSchemas>;

export const getAllModules = async (blockPath: string) => {
  const modules: ModuleSchemaType[] = [];
  getModulesFromDir(blockPath, modules);
  return modules;
};

const getModulesFromDir = async (
  folderPath: string,
  modules: ModuleSchemaType[],
  rootDir = folderPath,
) => {
  const files = fs.readdirSync(folderPath);
  files.forEach((file) => {
    const filePath = path.join(folderPath, file);
    const relativePath = path.relative(rootDir, filePath);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      getModulesFromDir(filePath, modules, rootDir);
    } else {
      const fileContent = fs.readFileSync(filePath, "utf8");
      const regex =
        /require\(['"](.+?)['"]\)|import\s+(\w+|{[\s\S]*?})\s+from\s+['"](.+?)['"]/g;

      let match;
      while ((match = regex.exec(fileContent)) !== null) {
        const modulePath = match[1] || match[3];
        modules.push({
          name: modulePath,
          path: relativePath,
          isBuiltIn: isBuiltin(modulePath),
        });
      }
    }
  });
};
