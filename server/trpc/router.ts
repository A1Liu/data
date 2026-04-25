import { healthProcedure } from "./procedures/health.ts";
import { router } from "./trpc.ts";

export const appRouter = router({
  health: healthProcedure,
});

export type AppRouter = typeof appRouter;
