import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'node:path'

// https://vite.dev/config/
// Multi-page build: the portfolio plus standalone project pages.
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['glass-refraction']
  },
  build: {
    rollupOptions: {
      input: {
        main: resolve(import.meta.dirname, 'index.html'),
        airlineDemo: resolve(import.meta.dirname, 'demo/airline-bi/index.html'),
        airlineCase: resolve(import.meta.dirname, 'casos/airline-bi/index.html'),
        evaluacionCase: resolve(import.meta.dirname, 'casos/evaluacion-curricular/index.html'),
      }
    }
  }
})
