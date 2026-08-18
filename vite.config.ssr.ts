import path from "node:path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "react": "preact/compat",
      "react-dom": "preact/compat",
      "react-dom/client": "preact/compat",
      "react-dom/server": "preact-render-to-string",
      "react/jsx-runtime": "preact/jsx-runtime",
      "react/jsx-dev-runtime": "preact/jsx-dev-runtime",
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets"),
    },
  },
  envDir: path.resolve(import.meta.dirname),
  build: {
    ssr: path.resolve(import.meta.dirname, "client", "src", "entry-server.tsx"),
    outDir: path.resolve(import.meta.dirname, "dist", "server-ssr"),
    emptyOutDir: false,
  },
  ssr: {
    noExternal: ["lucide-react"],
  },
});
