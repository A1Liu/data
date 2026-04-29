import { test as baseTest } from "vitest";
import { createContext } from "#server/trpc/context.ts";
import { createCaller } from "#server/trpc/router.ts";
import { createPrismaMockContext } from "./mock-db";

export const e2eTest = baseTest
  .extend(
    "dbURL",
    { scope: "worker" },
    () => "postgresql://postgres-user:password@192.168.194.69:5432/data-db",
  )
  .extend(
    "prismaMockContext",
    { scope: "worker" },
    async ({ dbURL }, { onCleanup }) => {
      const prismaMockContext = createPrismaMockContext({
        databaseUrl: dbURL,
      });
      onCleanup(async () => {
        await prismaMockContext.teardown();
      });

      await prismaMockContext.setup();
      return prismaMockContext;
    },
  )
  .extend("prisma", async ({ prismaMockContext }, { onCleanup }) => {
    const { client, beginTestTransaction, endTestTransaction } =
      prismaMockContext;
    onCleanup(async () => {
      endTestTransaction();
    });

    await beginTestTransaction();

    return client;
  })
  .extend("ctx", async ({ prisma }) => {
    const ctx = await createContext({ prisma });
    return ctx;
  })
  .extend("rpc", async ({ ctx }) => {
    const caller = createCaller(ctx);
    return caller;
  });
