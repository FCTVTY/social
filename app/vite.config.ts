import { execSync } from "child_process";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import nodePolyfills from "vite-plugin-node-stdlib-browser";

const version = execSync("./scripts/get-version.sh").toString().trim();

export default defineConfig({
  plugins: [react(), nodePolyfills()],
  define: {
    __APP_VERSION__: JSON.stringify(version),
    __VERSION_CHECK_INTERVAL__: 1000 * 30, // check new version every 30 seconds
  },
  css: {
    postcss: "./postcss.config.js",
  },
});
