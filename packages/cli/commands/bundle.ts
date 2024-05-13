import { writeBlock } from "@/utils/block";
import { handleError } from "@/utils/handle-error";
import { logger } from "@/utils/logger";
import { Command } from "commander";
import fs from "fs";
import path from "path";
import prompts from "prompts";

export const bundle = new Command()
  .name("bundle")
  .description("bundle a component to your project")
  .argument("blockDir", "the dir of the block to bundle")
  .option("-n, --name <name>", "the name of the block")
  .option("-d, --description <description>", "the description of the block")
  .option(
    "-c, --cwd <cwd>",
    "the working directory. defaults to the current directory.",
    process.cwd(),
  )
  .action(async (blockDir: string, opts) => {
    try {
      const blockDirArr = blockDir.split("/");
      const blockPath = path.resolve(opts.cwd, blockDir);
      const blockName = blockDirArr[blockDirArr.length - 1];

      if (!fs.existsSync(blockPath)) {
        throw new Error(`${blockDir} does not exist`);
      }

      const { name } = await prompts({
        type: "text",
        name: "name",
        hint: blockName,
        message: "What is the name of the block?",
        instructions: false,
      });

      const { description } = await prompts({
        type: "text",
        name: "description",
        message: "What is the description of the block?",
        instructions: false,
      });

      await writeBlock(name, {
        name: name,
        description: description,
        path: blockPath,
      });

      logger.success(`Block ${blockName} bundled successfully`);
    } catch (error) {
      handleError(error);
    }
  });
