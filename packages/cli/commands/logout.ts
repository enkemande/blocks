import { Command } from "commander";

export const logout = new Command()
  .name("logout")
  .description("logout from your account")
  .action(async () => {});
