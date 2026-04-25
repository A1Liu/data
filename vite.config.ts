import { resolve } from "node:path";
import tailwindcss from "@tailwindcss/vite";
import { devtools } from "@tanstack/devtools-vite";
import { tanstackRouter } from "@tanstack/router-plugin/vite";
import viteReact from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

const repoRoot = import.meta.dirname;

export default defineConfig({
  root: "client",
  build: {
    outDir: resolve(repoRoot, "dist/client"),
    emptyOutDir: true,
  },
  server: {
    port: 3000,
    proxy: {
      // Regex (^-prefixed) so `/trpc/health` is proxied but the source file
      // `/trpc.ts` that vite serves to the browser is NOT.
      "^/trpc/": { target: "http://localhost:4000", changeOrigin: true },
    },
  },
  preview: { host: true, port: 3000 },
  plugins: [
    devtools(),
    tsconfigPaths({ projects: [resolve(repoRoot, "tsconfig.json")] }),
    tailwindcss(),
    tanstackRouter({
      target: "react",
      autoCodeSplitting: true,
      routesDirectory: resolve(repoRoot, "client/routes"),
      generatedRouteTree: resolve(repoRoot, "client/routeTree.gen.ts"),
    }),
    viteReact(),
  ],
});
