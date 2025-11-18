import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react({
      jsxRuntime: 'automatic',
      // Enable Fast Refresh for Emotion
      babel: {
        plugins: ['@emotion/babel-plugin']
      }
    })
  ],
  server: {
    port: 3000,
    open: true
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'chakra-vendor': ['@chakra-ui/react', '@emotion/react', '@emotion/styled'],
          'motion-vendor': ['framer-motion']
        }
      }
    }
  }
})
