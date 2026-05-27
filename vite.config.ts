import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
import { getAppRoot, loadProjectEnv } from "./env";

loadProjectEnv(import.meta.dirname);

const appRoot = getAppRoot(import.meta.dirname);

export default defineConfig({
  plugins: [
    react(),
    runtimeErrorOverlay(),
    ...(process.env.NODE_ENV !== "production" &&
    process.env.REPL_ID !== undefined
      ? [
          await import("@replit/vite-plugin-cartographer").then((m) =>
            m.cartographer(),
          ),
          await import("@replit/vite-plugin-dev-banner").then((m) =>
            m.devBanner(),
          ),
        ]
      : []),
  ],
  resolve: {
    alias: {
      "@": path.resolve(appRoot, "client", "src"),
      "@shared": path.resolve(appRoot, "shared"),
      "@assets": path.resolve(appRoot, "attached_assets"),
    },
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
