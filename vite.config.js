import { defineConfig } from 'vite';
import { resolve } from 'node:path';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

// ❤️U Festival — Vite + React + PWA
// `base` must match the sub-folder the app is hosted in. Hosted at
// u240407.gluwebsite.nl/festivalapp/ → base '/festivalapp/'.
// (Use '/' if you ever host it at the domain root instead.)
export default defineConfig({
  base: '/festivalapp/',
  server: {
    port: 5180,
    // Proxy API calls to the Express backend during development.
    proxy: {
      '/api': { target: 'http://localhost:3001', changeOrigin: true },
    },
  },
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        admin: resolve(__dirname, 'admin.html'),
      },
    },
  },
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: '❤️U Festival',
        short_name: '❤️U',
        description: '❤️U Festival Utrecht 2026 — your pocket guide to stages, schedule & map',
        lang: 'nl',
        theme_color: '#F03228',
        background_color: '#000000',
        display: 'standalone',
        orientation: 'portrait',
        categories: ['entertainment', 'music'],
        icons: [
          { src: 'assets/logoBlack.webp', sizes: '192x192', type: 'image/webp', purpose: 'any' },
          { src: 'assets/logoBlack.webp', sizes: '512x512', type: 'image/webp', purpose: 'any maskable' },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,webp,svg,png,woff,woff2}'],
        maximumFileSizeToCacheInBytes: 5 * 1024 * 1024,
      },
    }),
  ],
});
