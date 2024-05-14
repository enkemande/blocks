import env from "@/config/env";
import { saveAuthData } from "@/utils/auth";
import { handleError } from "@/utils/handle-error";
import { logger } from "@/utils/logger";
import { spawn } from "child_process";
import { Command } from "commander";
import cookieParser from "cookie-parser";
import express from "express";
import { Server } from "http";
import ora from "ora";

let server: Server;

export const login = new Command()
  .name("login")
  .description("login to your account")
  .action(async () => {
    const spinner = ora();
    try {
      const app = express();
      const port = 3008;

      const callbackUrl = `http://localhost:${port}/callback`;

      app.use(cookieParser());

      app.get("/callback", async (req, res) => {
        const sessionToken = req.cookies["next-auth.session-token"];
        await saveAuthData({
          sessionToken,
          cookie: req.headers.cookie as string,
        });
        res.send("Authentication successful! You can close this window now.");
        server.close();
      });

      server = app.listen(port, () => {
        const authUrl = `${env.HOST}/api/auth/signin?callbackUrl=${callbackUrl}`;
        spawn("open", [authUrl]);
        logger.info(
          `Open this URL in your browser to authenticate: ${authUrl}`,
        );
      });
    } catch (error) {
      spinner.stop();
      server.close();
      handleError(error);
    }
  });
