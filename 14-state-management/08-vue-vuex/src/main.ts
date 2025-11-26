import { createApp } from 'vue'
import App from './App.vue'
import store from './store'
import './style.css'

// Create Vue app
const app = createApp(App)

// Use Vuex store
app.use(store)

// Mount the app
app.mount('#app')
