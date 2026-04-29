import { healthProcedure } from "./procedures/health.ts";
import { createCallerFactory, router } from "./trpc.ts";

export const appRouter = router({
  health: healthProcedure,
});

export const createCaller = createCallerFactory(appRouter);

export type AppRouter = typeof appRouter;
