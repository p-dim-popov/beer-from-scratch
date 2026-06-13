import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// On GitHub Pages the app is served from /<repo-name>/, while local dev
// runs at the root. We switch the base accordingly so assets resolve.
export default defineConfig(({ command }) => ({
  base: command === "build" ? "/beer-from-scratch/" : "/",
  plugins: [react()],
}));
