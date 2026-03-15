import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@core": "/src/core",
      "@infra": "/src/infra",
      "@mocks": "/src/mocks",
      "@ui": "/src/ui",
    },
  },
});
