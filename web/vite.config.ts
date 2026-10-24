import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "node:path";

export default defineConfig({
  root: path.resolve(import.meta.dirname),
  plugins: [react(), tailwindcss()],
  resolve: { alias: { "@shared": path.resolve(import.meta.dirname, "../shared"), "@web": path.resolve(import.meta.dirname, "src") } },
  server: { port: 5173, proxy: { "/api": "http://localhost:8787", "/health": "http://localhost:8787" } },
  build: { outDir: path.resolve(import.meta.dirname, "../dist/web"), emptyOutDir: true },
});
