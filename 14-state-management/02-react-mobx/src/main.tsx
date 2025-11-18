import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

/**
 * 應用入口文件
 *
 * MobX 不需要 Provider 組件（與 Redux 不同）
 * Store 可以直接作為模塊導入和使用
 *
 * 這是 MobX 的優勢之一：
 * - 不需要 Context Provider
 * - 不需要 HOC 或特殊的連接邏輯
 * - Store 是普通的 JavaScript 對象，可以直接導入使用
 */
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
