import { loadEnv } from "vite";
import { configDefaults, defineConfig } from "vitest/config";

export default defineConfig(({ mode }) => ({
  test: {
    exclude: [...configDefaults.exclude],
    env: loadEnv(mode, process.cwd(), ""),
  },
}));
