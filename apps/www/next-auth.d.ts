import { User } from "@/database/schema";
import "next-auth";

declare module "next-auth" {
  interface Session {
    user: User;
  }
}
