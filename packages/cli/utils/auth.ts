import fs from "fs";
import { writeFile } from "fs/promises";
import os from "os";
import path from "path";
import { z } from "zod";

const userHomeDir = os.homedir();
const cliAuthPath = path.resolve(userHomeDir, ".blocks", "auth.json");
const cilAuthDir = path.dirname(cliAuthPath);

export const authDataSchema = z.object({
  sessionToken: z.string(),
  cookie: z.string(),
});

export type AuthData = z.infer<typeof authDataSchema>;

export const saveAuthData = async (authData: AuthData) => {
  if (!fs.existsSync(cliAuthPath)) {
    fs.mkdirSync(cilAuthDir, { recursive: true });
  }
  await writeFile(cliAuthPath, JSON.stringify(authData, null, 2));
};

export const getAuthData = (): AuthData | null => {
  try {
    const data = fs.readFileSync(cliAuthPath, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    return null;
  }
};

export const removeAuthData = () => {
  fs.rmdirSync(cilAuthDir, { recursive: true });
};
