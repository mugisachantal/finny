import path from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    proxy: {
      "/api/v1/chat": { target: "http://localhost:8000", changeOrigin: true },
      "/api/v1/recommendations": { target: "http://localhost:8000", changeOrigin: true },
      "/api/v1/insights": { target: "http://localhost:8000", changeOrigin: true },
      "/api/v1/auth": { target: "http://localhost:8080", changeOrigin: true },
      "/api/v1/lenders": { target: "http://localhost:8080", changeOrigin: true },
      "/api/v1/loans": { target: "http://localhost:8080", changeOrigin: true },
    },
  },
});
