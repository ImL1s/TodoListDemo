import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import vue from '@astrojs/vue';

// https://astro.build/config
export default defineConfig({
  integrations: [
    react(), // Enable React components
    vue(),   // Enable Vue components (demonstrates multi-framework support)
  ],

  // SSG (Static Site Generation) optimization
  output: 'static',

  // Build optimization
  build: {
    inlineStylesheets: 'auto',
  },

  // Vite configuration for development
  vite: {
    build: {
      rollupOptions: {
        output: {
          // Minimize JS chunks
          manualChunks: undefined,
        },
      },
    },
  },
});
