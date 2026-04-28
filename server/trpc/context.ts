import type { CreateFastifyContextOptions } from "@trpc/server/adapters/fastify";
import { prisma } from "../db.ts";

export async function createContext({ req, res }: Partial<CreateFastifyContextOptions>) {
  return { prisma, req, res };
}

export type Context = Awaited<ReturnType<typeof createContext>>;
