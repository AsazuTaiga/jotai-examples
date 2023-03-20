import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  // github pages
  base: "/jotai-examples/",
  plugins: [react()],
});
