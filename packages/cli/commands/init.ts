import { writeBlockConfig } from "@/utils/block";
import { Command } from "commander";
import ora from "ora";
import prompts from "prompts";

export const init = new Command()
  .name("init")
  .description("initialize block in your project")
  .action(async () => {
    const spinner = ora();
    try {
      const { destination } = await prompts({
        type: "text",
        name: "destination",
        message: "Where would you like your block to be saved?",
        instructions: false,
      });
      spinner.start("Initializing block....");
      await writeBlockConfig({ destination });
      spinner.succeed("Block initialized successfully");
    } catch (error) {
      console.log(error);
      spinner.stop();
    }
  });
