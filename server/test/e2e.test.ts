import { e2eTest } from "./e2e-test";

e2eTest("e2e", async ({ rpc, expect }) => {
  const post = await rpc.health.apply({});
  expect(post).toBeDefined();
});

e2eTest("prisma test", async ({ prisma, expect }) => {
  const result = await prisma.$queryRaw`SELECT 1 as data`;
  expect(result).toEqual([{ data: 1 }]);
});
