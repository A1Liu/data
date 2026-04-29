import type { CreateFastifyContextOptions } from "@trpc/server/adapters/fastify";
import type { PrismaClient } from "generated/prisma/client.ts";
import { getPrismaSingleton } from "../db.ts";

export async function createContext({
  prisma,
  req,
  res,
}: Partial<CreateFastifyContextOptions> & {
  prisma?: PrismaClient;
}) {
  return { prisma: prisma ?? getPrismaSingleton(), req, res };
}

export type Context = Awaited<ReturnType<typeof createContext>>;
