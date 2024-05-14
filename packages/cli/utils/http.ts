import env from "@/config/env";
import axios from "axios";
import { getAuthData } from "./auth";

export const http = axios.create({
  baseURL: env.HOST,
  headers: {
    cookie: `next-auth.session-token=${getAuthData()?.sessionToken}`,
  },
});
