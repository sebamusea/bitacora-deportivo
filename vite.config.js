import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  // Si vas a publicar en GitHub Pages en un repo que se llama 'bitacora-rde', deja esta línea:
  // base: '/bitacora-rde/',
})
