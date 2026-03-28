import { defineConfig, mergeConfig } from "vitest/config";

import viteConfig from "./vite.config.mjs";

export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      include: ["tests/unit/**/*.test.ts", "tests/integration/**/*.test.ts"],
      coverage: {
        provider: "v8",
        reporter: ["text", "html"],
        reportsDirectory: "./coverage",
        include: ["src/**/*.ts"],
        exclude: ["src/vite-env.d.ts", "tests/**/*.ts"],
      },
    },
  }),
);
