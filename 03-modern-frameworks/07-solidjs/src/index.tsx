/* @refresh reload */
import { render } from 'solid-js/web'
import App from './App'
import './App.css'

const root = document.getElementById('root')

// SolidJS 的渲染方式
// 與 React 不同，SolidJS 使用 dispose 函數來清理，而不是 unmount
render(() => <App />, root!)
