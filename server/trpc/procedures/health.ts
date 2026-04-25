import { publicProcedure } from "../trpc.ts";

export const healthProcedure = publicProcedure.query(async ({ ctx }) => ({
  ok: true,
  time: new Date(),
}));
