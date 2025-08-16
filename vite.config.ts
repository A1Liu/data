import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import { tanstackRouter } from "@tanstack/router-plugin/vite";
import react from "@vitejs/plugin-react-swc";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    // Order matters, must be before react plugin
    tanstackRouter({
      target: "react",
      autoCodeSplitting: true,
      routesDirectory: "./webapp/routes",
      generatedRouteTree: "./webapp/routeTree.gen.ts",
    }),
    react(),
    tailwindcss(),
  ],
  root: "./webapp",
});
