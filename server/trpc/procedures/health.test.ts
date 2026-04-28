import { expect, test } from "vitest";
import { createContext } from "../context";
import { createCaller } from "../router";

test("health check", async () => {
  const ctx = await createContext({});
  const caller = createCaller(ctx);

  const post = await caller.health.apply({});

  expect(post.ok).toBe(true);
});
