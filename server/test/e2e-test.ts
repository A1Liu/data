import { test as baseTest } from "vitest";
import { createPrismaMockContext as createPrismaContext } from "./mock-db";
import { createCaller } from "#server/trpc/router.ts";
import { createContext } from "#server/trpc/context.ts";

export const test = baseTest
  .extend(
    "prismaMockContext",
    { scope: "worker" },
    async (_ctx, { onCleanup }) => {
      const prismaMockContext = createPrismaContext({
        databaseUrl:
          "postgresql://postgres-user:password@192.168.194.69:5432/data-db",
      });
      onCleanup(async () => {
        await prismaMockContext.teardown();
      });

      await prismaMockContext.setup();
      return prismaMockContext;
    },
  )
  .extend("prisma", {}, async ({ prismaMockContext }, { onCleanup }) => {
    const { client, beginTestTransaction, endTestTransaction } =
      prismaMockContext;
    onCleanup(async () => {
      endTestTransaction();
    });

    await beginTestTransaction();

    return client;
  })
  // Function fixture - type is inferred from return value
  .extend("caller", async ({ prisma }) => {
    const ctx = await createContext({ prisma });
    const caller = createCaller(ctx);

    return caller;
  });
