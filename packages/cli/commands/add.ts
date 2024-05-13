import { getBlockConfig } from "@/utils/block";
import { handleError } from "@/utils/handle-error";
import { http } from "@/utils/http";
import AdmZip from "adm-zip";
import { Command } from "commander";
import ora from "ora";
import path from "path";

export const add = new Command()
  .name("add")
  .description("add a block component to your project")
  .argument("[blockPath...]", "the blocks to add")
  .action(async (blockPaths: string[]) => {
    const spinner = ora();
    try {
      spinner.start("Adding block....");
      const { destination } = await getBlockConfig();
      for (const blockPath of blockPaths) {
        const blockPathArr = blockPath.split("/");
        const name = blockPathArr[blockPathArr.length - 1];
        const extractDir = path.resolve(process.cwd(), destination, name);
        const response = await http({
          method: "GET",
          url: `/api/blocks/download/${blockPath}`,
          responseType: "arraybuffer",
        });
        const zip = new AdmZip(response.data);
        zip.extractAllTo(extractDir, true);
        spinner.succeed(`Block ${name} added successfully`);
      }
    } catch (error) {
      spinner.stop();
      handleError(error);
    }
  });
