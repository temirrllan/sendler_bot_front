// frontend/vite.config.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from '@tailwindcss/vite';
import path from 'path';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  
  // Build settings для production
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'esbuild',
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'index.html'),
        admin: path.resolve(__dirname, 'admin.html'),  // ✅ Админка
      },
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'ui-vendor': ['framer-motion', 'lucide-react'],
        }
      },
    }
  },
  
  // Server settings для dev
  server: {
    port: 5173,
    host: true,
    allowedHosts: [
      "localhost",
      "127.0.0.1",
      ".ngrok-free.app",
      ".vercel.app",
    ],
  },
  
  // Preview settings
  preview: {
    port: 5173,
    host: true,
  },
  
  // Resolve aliases
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});