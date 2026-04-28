/**
 * Integration test example for the `post` router
 */
import { expect, test } from "vitest";
import { createContext } from "../context";
import { createCaller } from "../router";

test("add and get post", async () => {
  const ctx = await createContext({});
  const caller = createCaller(ctx);

  const post = await caller.health.apply({});

  expect(post.ok).toBe(true);
});
