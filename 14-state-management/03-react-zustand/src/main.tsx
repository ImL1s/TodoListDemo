import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'

/**
 * 應用入口
 *
 * 注意：與 Redux 不同，Zustand 不需要 Provider
 * 直接渲染 App 組件即可
 */
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
