import { e2eTest } from "#server/test/e2e-test.ts";

e2eTest("health check", async ({ rpc, expect }) => {
  const result = await rpc.health.apply({});

  expect(result?.ok).toBe(true);
});
