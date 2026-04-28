import { expect, test } from "vitest";
import { createContext as createPrismaContext } from "../../test/mock-db";
import { createContext } from "../context";
import { createCaller } from "../router";

test("health check", async () => {
  const prismaMockContext = createPrismaContext({});

  const ctx = await createContext({ prisma: prismaMockContext.client });
  const caller = createCaller(ctx);

  await prismaMockContext.setup();

  await prismaMockContext.beginTestTransaction();

  const post = await caller.health.apply({});

  expect(post.ok).toBe(true);

  prismaMockContext.endTestTransaction();

  await prismaMockContext.teardown();
});
