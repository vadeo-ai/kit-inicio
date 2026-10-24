import { defineConfig } from "vitest/config";
import path from "node:path";
export default defineConfig({
  resolve: { alias: { "@shared": path.resolve("shared"), "@db": path.resolve("db") } },
  test: { include: ["pruebas/**/*.test.ts"] },
});
