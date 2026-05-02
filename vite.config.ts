import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    host: "::",
    port: 8081,
    proxy: {
      // Local dev proxy — lets you test against the live HF Space
      // without CORS issues during npm run dev
      '/api': {
        target: 'https://yasithadulara-animal-sound-safari-backend.hf.space',
        changeOrigin: true,
        secure: true,
      },
    },
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
