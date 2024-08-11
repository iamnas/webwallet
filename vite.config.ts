import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { nodePolyfills } from 'vite-plugin-node-polyfills';

import wasm from "vite-plugin-wasm";
import topLevelAwait from "vite-plugin-top-level-await";


export default defineConfig({
  optimizeDeps: {
    exclude: ["vite-repro-worker"],
  },
  plugins: [
    nodePolyfills(),
    wasm(),
    topLevelAwait(),
    react()],
  esbuild: {
    target: "es2022", // Ensure modern JS features like top-level await are supported
  },
});
