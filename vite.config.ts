import { fileURLToPath } from "node:url";
import { visualizer } from "rollup-plugin-visualizer";
import { defineConfig } from "vite";
import compression from "vite-plugin-compression";
import restart from "vite-plugin-restart";

export default defineConfig({
  root: "src/",
  publicDir: "../static/",
  server: {
    host: true,
    port: 3000,
    open: !("SANDBOX_URL" in process.env || "CODESANDBOX_HOST" in process.env),
    hmr: {
      port: 3001,
    },
  },
  build: {
    outDir: "../dist",
    emptyOutDir: true,
    sourcemap: true,
    target: "esnext",

    rollupOptions: {
      output: {
        manualChunks: {
          three: ["three"],
          gsap: ["gsap"],
          vendor: ["lil-gui"],
        },
      },
    },

    assetsInlineLimit: 4096,
    chunkSizeWarningLimit: 1000,

    minify: "terser",
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
  },

  resolve: {
    alias: [
      {
        find: "@",
        replacement: fileURLToPath(new URL("./src", import.meta.url)),
      },
    ],
  },

  optimizeDeps: {
    include: ["three", "gsap", "lil-gui"],
  },

  plugins: [
    restart({
      restart: ["../static/**"],
    }),

    compression({
      algorithm: "brotliCompress",
    }),

    visualizer({
      filename: "dist/stats.html",
      open: false,
      gzipSize: true,
      brotliSize: true,
    }),
  ],
});
