import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5174,
    open: true
    // proxy: {
    //   "/api": "http://localhost:5000"
    // }
  },
  build: {
    outDir: "dist",
  },
  resolve: {
    alias: {
      '@': '/src',
    },
  },
  // ✅ Add this to fix 404 on refresh
  esbuild: {
    jsxInject: `import React from 'react'`,
  },
  define: {
    "process.env": {},
  },
});
