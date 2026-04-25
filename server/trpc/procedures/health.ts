import { publicProcedure } from "../trpc.ts";

export const healthProcedure = publicProcedure.query(async () => ({
  ok: true,
  time: new Date(),
}));
