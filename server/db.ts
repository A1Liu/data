import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client.js";

let GlobalPrisma: PrismaClient | undefined;
export function getPrismaSingleton() {
  if (GlobalPrisma) {
    return GlobalPrisma;
  }

  const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL ?? "",
  });
  GlobalPrisma = new PrismaClient({ adapter });
  return GlobalPrisma;
}
