import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [
    tailwindcss(),
    react({
      babel: {
        plugins: [["babel-plugin-react-compiler"]],
      },
    }),
  ],
  server: {
    watch: {
      usePolling: true, // Try this if normal watching fails
    },
    hmr: {
      overlay: true,
    },
  },
});
