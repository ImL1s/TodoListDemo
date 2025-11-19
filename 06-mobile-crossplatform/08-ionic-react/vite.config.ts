import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    host: 'localhost',
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    // 代码分割优化
    rollupOptions: {
      output: {
        manualChunks: {
          'ionic-core': ['@ionic/react', '@ionic/react-router'],
          'ionic-icons': ['ionicons'],
          'capacitor': [
            '@capacitor/core',
            '@capacitor/preferences',
            '@capacitor/haptics',
            '@capacitor/keyboard',
            '@capacitor/network',
            '@capacitor/app',
            '@capacitor/status-bar',
            '@capacitor/splash-screen',
          ],
          vendor: ['react', 'react-dom', 'react-router-dom'],
        },
      },
    },
    // 性能优化
    chunkSizeWarningLimit: 1000,
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
  },
  resolve: {
    alias: {
      '@': '/src',
    },
  },
  optimizeDeps: {
    include: [
      '@ionic/react',
      '@ionic/react-router',
      'ionicons',
      'react',
      'react-dom',
      'react-router-dom',
    ],
  },
});
