"use server";
import { createCaller } from "@/routes";
import { createTRPCContext } from "@/trpc";
import { headers } from "next/headers";
import { cache } from "react";

const createContext = cache(() => {
  const heads = new Headers(headers());
  heads.set("x-trpc-source", "blocks");

  return createTRPCContext({
    headers: heads,
  });
});

export const trpcCaller = createCaller(createContext);
