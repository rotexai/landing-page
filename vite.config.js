import { resolve } from 'node:path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
// Two pages: the landing page and rotexai.com/marketplace/ (GitHub Pages serves dist/marketplace/index.html there).
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        main: resolve(import.meta.dirname, 'index.html'),
        marketplace: resolve(import.meta.dirname, 'marketplace/index.html'),
        pricing: resolve(import.meta.dirname, 'pricing/index.html'),
        docs: resolve(import.meta.dirname, 'docs/index.html'),
      },
    },
  },
})
