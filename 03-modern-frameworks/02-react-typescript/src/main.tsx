import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './App.css'

// 使用 TypeScript 的非空斷言操作符，因為我們確定 root 元素存在
const rootElement = document.getElementById('root')!;

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
