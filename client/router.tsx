import { QueryClient } from "@tanstack/react-query";
import { createRouter as createTanStackRouter } from "@tanstack/react-router";
import { httpBatchLink } from "@trpc/client";
import superjson from "superjson";
import { routeTree } from "./routeTree.gen";
import { trpc } from "./trpc";

export const queryClient = new QueryClient();

export const trpcClient = trpc.createClient({
  links: [httpBatchLink({ url: "/trpc", transformer: superjson })],
});

export const router = createTanStackRouter({
  routeTree,
  context: { queryClient, trpc },
  scrollRestoration: true,
  defaultPreload: "intent",
  defaultPreloadStaleTime: 0,
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
