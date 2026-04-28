import { fastifyTRPCPlugin } from "@trpc/server/adapters/fastify";
import Fastify from "fastify";
import { createContext } from "./trpc/context.ts";
import { appRouter } from "./trpc/router.ts";

const app = Fastify({ logger: true, maxParamLength: 5000 });

await app.register(fastifyTRPCPlugin, {
  prefix: "/trpc",
  trpcOptions: {
    router: appRouter,
    createContext,
    onError({ path, error }: { path?: string; error: Error }) {
      app.log.error({ path, error }, "tRPC error");
    },
  },
});


app.get("/healthz", async () => ({ ok: true }));

try {
  await app.listen({
    port: Number(process.env.PORT ?? 4000),
    host: process.env.HOST ?? "0.0.0.0",
  });
} catch (err) {
  app.log.error(err);
  process.exit(1);
}
