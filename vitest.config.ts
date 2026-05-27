import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "node:path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: { "@": path.resolve(__dirname, "src") },
  },
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./src/test/setup.ts"],
    coverage: {
      provider: "v8",
      reporter: ["text", "json-summary", "lcov"],
      includeUntested: true,
      include: [
        "src/lib/**/*.ts",
        "src/components/today/**/*.tsx",
        "src/app/page.tsx",
      ],
      exclude: [
        "src/lib/types/**",
        "src/lib/state/**",
        "src/lib/seed/**",
      ],
    },
  },
});
