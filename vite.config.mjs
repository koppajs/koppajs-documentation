import koppaPlugin from "@koppajs/koppajs-vite-plugin";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [
    koppaPlugin({
      tsconfigFile: "./tsconfig.json",
    }),
  ],
});
