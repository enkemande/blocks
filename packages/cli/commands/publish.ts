import { readBlock } from "@/utils/block";
import { createFolderFormData } from "@/utils/create-folder-form-data";
import { handleError } from "@/utils/handle-error";
import { http } from "@/utils/http";
import chalk from "chalk";
import { Command } from "commander";
import FormData from "form-data";
import ora from "ora";

export const publish = new Command()
  .name("publish")
  .description("add a component to your project")
  .argument("[blockNames...]", "the blocks to add")
  .action(async (blockNames: string[]) => {
    const spinner = ora();
    try {
      spinner.start("Publishing block....");
      for (const blockName of blockNames) {
        const block = await readBlock(blockName);
        const formData = new FormData();
        formData.append("name", block.name);
        formData.append("description", block.description);
        createFolderFormData(block.path, formData);
        await http.post("/api/blocks/publish", formData, {
          headers: { ...formData.getHeaders() },
        });
      }
      spinner.succeed(chalk.green("Block published successfully"));
    } catch (error) {
      spinner.stop();
      handleError(error);
    }
  });
