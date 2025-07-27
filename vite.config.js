
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: "jsdom",
  },
  server: {
    host: "0.0.0.0",
    port: 3000,
    hmr: {
      port: 3000,
    },
    allowedHosts: [
      "074f3752-5e5d-403f-9a12-57fd1e394ae5-00-2gmgxo5mbz739.riker.replit.dev",
      "localhost",
      ".replit.dev"
    ],
  },
  preview: {
    host: "0.0.0.0",
    port: 3000,
  },
});
