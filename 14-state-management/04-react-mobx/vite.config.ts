import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
// 注意：雖然當前實現使用 makeAutoObservable，
// 但保留裝飾器支持以便未來擴展（如在 README 中所示）
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
  },
});
