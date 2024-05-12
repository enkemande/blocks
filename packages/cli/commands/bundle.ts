import { writeBlock } from "@/utils/block";
import { handleError } from "@/utils/handle-error";
import { logger } from "@/utils/logger";
import { Command } from "commander";
import fs from "fs";
import ora from "ora";
import path from "path";

// npx blocks bundle <blockDir>
// npx blocks bundle ./blocks/button
// npx blocks bundle ./blocks/button --name my-button
// npx blocks bundle ./blocks/button --name my-button --description "My custom button"

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
    const spinner = ora(`Bundling...`).start();
    try {
      const blockDirArr = blockDir.split("/");
      const blockPath = path.resolve(opts.cwd, blockDir);
      const blockName = blockDirArr[blockDirArr.length - 1];

      if (!fs.existsSync(blockPath)) {
        throw new Error(`${blockDir} does not exist`);
      }

      await writeBlock(blockName, {
        name: blockName,
        version: "1.0.0",
        description: "A table component",
        path: blockPath,
        modules: [],
      });

      spinner.stop();
      logger.success(`Block ${blockName} bundled successfully`);
    } catch (error) {
      spinner.stop();
      handleError(error);
    }
  });
