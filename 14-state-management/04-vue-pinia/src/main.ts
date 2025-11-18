import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { piniaLocalStoragePlugin } from './plugins/piniaLocalStorage'
import App from './App.vue'
import './style.css'

/**
 * Vue 3 + Pinia 應用程式入口
 *
 * 1. 創建 Vue 應用實例
 * 2. 創建 Pinia 實例並註冊持久化插件
 * 3. 掛載應用
 */

// 創建 Pinia 實例
const pinia = createPinia()

// 註冊 localStorage 持久化插件
pinia.use(piniaLocalStoragePlugin)

// 創建 Vue 應用
const app = createApp(App)

// 使用 Pinia
app.use(pinia)

// 掛載應用
app.mount('#app')
