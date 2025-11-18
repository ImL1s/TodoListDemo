import { defineConfig } from 'vite'
import solid from 'vite-plugin-solid'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [solid()],
  server: {
    port: 3000,
    open: true
  },
  build: {
    outDir: 'dist',
    sourcemap: true
  }
})
