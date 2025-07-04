import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  esbuild: {
    include: /\.(jsx?|tsx?)$/,
    loader: "jsx",
  },
});
