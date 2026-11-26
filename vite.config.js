import { resolve } from 'node:path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
// One Vite page per path: the landing page, /marketplace/, /pricing/, /docs/ and /contact/ (GitHub Pages serves
// dist/<path>/index.html there).
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        main: resolve(import.meta.dirname, 'index.html'),
        marketplace: resolve(import.meta.dirname, 'marketplace/index.html'),
        pricing: resolve(import.meta.dirname, 'pricing/index.html'),
        docs: resolve(import.meta.dirname, 'docs/index.html'),
        contact: resolve(import.meta.dirname, 'contact/index.html'),
      },
    },
  },
})
