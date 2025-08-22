import { fileURLToPath } from "node:url";
import restart from "vite-plugin-restart";

export default {
  root: "src/",
  publicDir: "../static/",
  server: {
    host: true,
    open: !("SANDBOX_URL" in process.env || "CODESANDBOX_HOST" in process.env), // Open if it's not a CodeSandbox
  },
  build: {
    outDir: "../dist",
    emptyOutDir: true,
    sourcemap: true,
  },
  resolve: {
    alias: [
      {
        find: "@",
        replacement: fileURLToPath(new URL("./src", import.meta.url)),
      },
    ],
  },
  plugins: [restart({ restart: ["../static/**"] })],
};
