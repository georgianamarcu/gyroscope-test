// vite.config.ts
import { defineConfig } from "vite";
import viteReact from "@vitejs/plugin-react";
import glsl from "vite-plugin-glsl";
//@ts-expect-error Will fix later
import path from "path";
import { TanStackRouterVite } from "@tanstack/router-plugin/vite";

export default defineConfig({
  plugins: [
    TanStackRouterVite(),
    viteReact(),
    glsl({
      include: "**/*.glsl",
    }),
  ],
  resolve: {
    alias: {
      //@ts-expect-error Will fix later
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        entryFileNames: `assets/entry.js`,
        chunkFileNames: `assets/script.js`,
        assetFileNames: `assets/[name].[ext]`,
      },
    },
  },
  server: {
    host: true,
    port: 2000,
    origin: "http://localhost:2000",
  },
  logLevel: "info",
});
