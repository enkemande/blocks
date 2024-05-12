#!/usr/bin/env node
import { add } from "@/commands/add";
import { bundle } from "@/commands/bundle";
import { publish } from "@/commands/publish";
import { Command } from "commander";

process.on("SIGINT", () => process.exit(0));
process.on("SIGTERM", () => process.exit(0));

async function main() {
  const program = new Command()
    .name("blocks")
    .description("add components and dependencies to your project")
    .version("1.0.0", "-v, --version", "display the version number");

  program.addCommand(bundle).addCommand(publish).addCommand(add);
  program.parse(process.argv);
}

main();
