import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  erver: {
    allowedHosts: [
      "localhost",
      "127.0.0.1",
      "d77fb389002b.ngrok-free.app", // ← твой ngrok-домен
    ],
    host: true,
  },
});
