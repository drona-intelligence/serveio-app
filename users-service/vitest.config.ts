import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    environment: "node",
    env: {
      DATABASE_URL: process.env.DATABASE_URL || "postgresql://postgres:root@localhost:5432/serveio-app",
      JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET || "test-access-secret-key",
      JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET || "test-refresh-secret-key",
    },
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      exclude: [
        "node_modules/",
        "dist/",
        "**/*.test.ts",
        "**/*.spec.ts",
        "**/tests/**",
      ],
    },
  },
});
