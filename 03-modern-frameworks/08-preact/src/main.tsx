import { render } from 'preact'
import App from './App'
import './App.css'

// Preact 的 render 方法比 React 更簡潔
// 直接使用 render() 而不需要 createRoot()
render(<App />, document.getElementById('root')!);
