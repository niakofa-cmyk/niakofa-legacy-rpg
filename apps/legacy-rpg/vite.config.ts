import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";

export default defineConfig({
  plugins: [react()],
  root: path.resolve(import.meta.dirname),
  resolve: {
    alias: { "@": path.resolve(import.meta.dirname, "src") },
    dedupe: ["react", "react-dom"],
  },
  server: {
    host: "0.0.0.0",
    port: Number(process.env.PORT ?? 5000),
    strictPort: true,
    allowedHosts: true,
    headers: { "Cache-Control": "no-store" },
  },
  preview: { host: "0.0.0.0", port: 5000, allowedHosts: true },
});