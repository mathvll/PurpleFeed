import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { fileURLToPath } from "url";
import { loadProjectEnv } from "../server/env";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const appRoot = path.resolve(__dirname, "..");

loadProjectEnv(appRoot);

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(appRoot, "client", "src"),
      "@shared": path.resolve(appRoot, "shared"),
      "@assets": path.resolve(appRoot, "docs", "assets"),
    },
  },
  css: {
    postcss: path.resolve(__dirname, "postcss.config.js"),
  },
  root: path.resolve(appRoot, "client"),
  build: {
    outDir: path.resolve(appRoot, "dist/public"),
    emptyOutDir: true,
  },
  server: {
    fs: {
      strict: true,
      deny: ["**/.*"],
    },
  },
});


