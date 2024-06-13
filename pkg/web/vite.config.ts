import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import tsconfigPaths from "vite-tsconfig-paths";

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {},
  },
  css: {
    modules: {
      localsConvention: "camelCase",
      generateScopedName: "[name]-[hash:base64:2]__[local]"
    }
  },
  plugins: [react(), tsconfigPaths()],
});
