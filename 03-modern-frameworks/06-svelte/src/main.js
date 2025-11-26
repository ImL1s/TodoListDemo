import './app.css'
import App from './App.svelte'

// 掛載 Svelte 應用到 DOM
const app = new App({
  target: document.getElementById('app'),
})

export default app
