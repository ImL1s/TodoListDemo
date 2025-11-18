# Nuxt 3 Todo List - 全棧應用

一個使用 Nuxt 3 構建的全棧 Todo List 應用，展示了 Vue 3 元框架的強大功能和現代化開發體驗。

## 技術棧

- **Nuxt 3** - Vue 3 元框架
- **Vue 3** - 漸進式 JavaScript 框架
- **TypeScript** - 類型安全
- **Server API** - 內建後端 API
- **文件系統路由** - 自動路由生成
- **Auto Imports** - 自動導入

## 項目結構

```
02-nuxt/
├── assets/
│   └── styles/
│       └── main.css              # 全局樣式
├── components/
│   ├── TodoInput.vue             # Todo 輸入組件
│   ├── TodoItem.vue              # Todo 項目組件
│   └── TodoList.vue              # Todo 列表組件
├── pages/
│   └── index.vue                 # 首頁（自動路由）
├── server/
│   └── api/
│       └── todos.ts              # Server API 端點
├── data/
│   └── todos.json                # 數據存儲（自動生成）
├── app.vue                       # 根組件
├── nuxt.config.ts                # Nuxt 配置
├── tsconfig.json                 # TypeScript 配置
├── package.json
└── README.md
```

## Nuxt 3 核心特性

### 1. Vue 3 元框架

Nuxt 3 是基於 Vue 3 的元框架，提供了開箱即用的全棧能力：

```
Vue 3 核心
    ↓
Nuxt 3 元框架
    ↓
SSR + 文件系統路由 + Server API + Auto Imports
```

**元框架優勢：**
- 🚀 零配置即可開始
- 📦 內建最佳實踐
- 🔧 可擴展的架構
- 🎯 全棧能力

### 2. SSR（服務器端渲染）

Nuxt 3 默認啟用 SSR，提供卓越的性能和 SEO：

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  ssr: true, // 默認啟用
})
```

**SSR 優勢：**

#### 性能優化
- **更快的首屏加載**：服務器直接返回渲染好的 HTML
- **減少客戶端計算**：服務器完成初始渲染
- **漸進式增強**：即使 JavaScript 未加載也能顯示內容

#### SEO 優化
- 搜索引擎可以直接索引完整的 HTML 內容
- 動態 meta 標籤支持
- Open Graph 和 Twitter Cards 支持

```vue
<!-- pages/index.vue -->
<script setup lang="ts">
// 設置頁面元數據（自動處理 SEO）
useHead({
  title: '首頁'
})

useSeoMeta({
  title: 'Nuxt 3 Todo List',
  description: '使用 Nuxt 3 構建的全棧應用',
  ogImage: '/og-image.png'
})
</script>
```

#### 混合渲染模式

Nuxt 3 支持多種渲染模式：

| 模式 | 說明 | 使用場景 |
|------|------|---------|
| **SSR** | 服務器端渲染 | 需要 SEO 的動態頁面 |
| **SSG** | 靜態站點生成 | 內容不常變化的頁面 |
| **CSR** | 客戶端渲染 | 需要用戶交互的頁面 |
| **混合** | 混合使用上述模式 | 複雜應用 |

```typescript
// 靜態生成
export const prerender = true

// 客戶端渲染
export const ssr = false
```

### 3. Auto Imports（自動導入）

Nuxt 3 自動導入 Vue 3、Nuxt 和項目中的組件、composables：

```vue
<script setup lang="ts">
// ✅ 無需導入！這些都是自動導入的：
const count = ref(0)           // Vue 3 ref
const route = useRoute()       // Nuxt useRoute
const { data } = await useFetch('/api/todos') // Nuxt useFetch

// 計算屬性
const doubled = computed(() => count.value * 2)

// 生命週期
onMounted(() => {
  console.log('組件已掛載')
})
</script>
```

**自動導入的內容：**

#### Vue 3 API
```typescript
ref, reactive, computed, watch, watchEffect
onMounted, onUnmounted, onBeforeMount, onBeforeUnmount
defineProps, defineEmits, defineExpose
// ... 所有 Vue 3 Composition API
```

#### Nuxt Composables
```typescript
useRoute()          // 獲取當前路由
useRouter()         // 路由器實例
useFetch()          // 數據獲取
useAsyncData()      // 異步數據
useHead()           // 管理 head 標籤
useSeoMeta()        // SEO meta 標籤
$fetch()            // HTTP 請求工具
navigateTo()        // 編程式導航
// ... 更多
```

#### 組件自動導入
```vue
<template>
  <!-- ✅ 無需導入組件！ -->
  <TodoInput />
  <TodoList />
</template>

<script setup lang="ts">
// ❌ 不需要：
// import TodoInput from '~/components/TodoInput.vue'
// import TodoList from '~/components/TodoList.vue'
</script>
```

#### 自定義自動導入

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  imports: {
    dirs: [
      'composables',      // ~/composables/**
      'composables/**',
      'utils',           // ~/utils/**
      'utils/**'
    ]
  }
})
```

### 4. Server API（服務器 API）

Nuxt 3 提供強大的服務器端 API 開發能力：

```typescript
// server/api/todos.ts
export default defineEventHandler(async (event) => {
  const method = event.method

  if (method === 'GET') {
    const todos = await readTodos()
    return todos
  }

  if (method === 'POST') {
    const body = await readBody(event)
    // 處理邏輯...
    return newTodo
  }

  // ... 其他方法
})
```

**Server API 特點：**

#### 統一的 API 處理器
- 單個文件處理所有 HTTP 方法
- 使用 `event.method` 區分請求類型
- 類型安全的請求/響應

#### 內建工具函數
```typescript
// 讀取請求體
const body = await readBody(event)

// 獲取查詢參數
const query = getQuery(event)

// 設置響應狀態
setResponseStatus(event, 201)

// 創建錯誤
throw createError({
  statusCode: 400,
  statusMessage: '無效的請求'
})
```

#### API 路由映射

文件系統自動映射為 API 路由：

```
server/api/todos.ts       → /api/todos
server/api/users/[id].ts  → /api/users/:id
server/api/posts/index.ts → /api/posts
```

#### 中間件支持

```typescript
// server/middleware/auth.ts
export default defineEventHandler(async (event) => {
  // 全局中間件邏輯
  const token = getHeader(event, 'authorization')
  if (!token) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized'
    })
  }
})
```

### 5. 文件系統路由

Nuxt 3 自動根據 `pages/` 目錄生成路由：

```
pages/
├── index.vue           → /
├── about.vue          → /about
├── posts/
│   ├── index.vue      → /posts
│   └── [id].vue       → /posts/:id
└── [...slug].vue      → /* (捕獲所有路由)
```

**動態路由：**

```vue
<!-- pages/posts/[id].vue -->
<script setup lang="ts">
const route = useRoute()
const id = route.params.id

const { data: post } = await useFetch(`/api/posts/${id}`)
</script>
```

**嵌套路由：**

```
pages/
├── parent/
│   ├── index.vue      → /parent
│   └── child.vue      → /parent/child
```

### 6. $fetch - HTTP 客戶端

Nuxt 3 提供 `$fetch` 工具，基於 ofetch：

```typescript
// 自動導入，無需 import
const data = await $fetch('/api/todos')

// POST 請求
await $fetch('/api/todos', {
  method: 'POST',
  body: { text: 'New todo' }
})

// 錯誤處理
try {
  await $fetch('/api/todos')
} catch (error) {
  console.error('請求失敗:', error)
}
```

**$fetch 特點：**
- 自動處理 JSON
- 支持 TypeScript 類型
- 自動重試
- 攔截器支持

### 7. useFetch - 數據獲取

```vue
<script setup lang="ts">
// 響應式數據獲取
const { data, pending, error, refresh } = await useFetch('/api/todos')

// 帶參數
const { data } = await useFetch('/api/todos', {
  query: { filter: 'active' }
})

// 轉換數據
const { data } = await useFetch('/api/todos', {
  transform: (todos) => todos.filter(t => !t.completed)
})
</script>

<template>
  <div v-if="pending">加載中...</div>
  <div v-else-if="error">錯誤: {{ error.message }}</div>
  <div v-else>
    <!-- 使用數據 -->
  </div>
</template>
```

## 功能實現

### 1. Todo CRUD 操作

| 操作 | API 端點 | HTTP 方法 | 處理函數 |
|------|---------|----------|---------|
| 獲取所有 | `/api/todos` | GET | `method === 'GET'` |
| 新增 | `/api/todos` | POST | `method === 'POST'` |
| 更新狀態 | `/api/todos` | PATCH | `method === 'PATCH'` |
| 刪除 | `/api/todos` | DELETE | `method === 'DELETE'` |

### 2. 組件通信

使用瀏覽器原生事件進行組件間通信：

```typescript
// 發送事件（TodoInput.vue）
if (process.client) {
  window.dispatchEvent(new Event('todosUpdated'))
}

// 監聽事件（TodoList.vue）
onMounted(() => {
  if (process.client) {
    window.addEventListener('todosUpdated', handleTodosUpdate)
  }
})

onUnmounted(() => {
  if (process.client) {
    window.removeEventListener('todosUpdated', handleTodosUpdate)
  }
})
```

**為什麼使用 `process.client`？**
- Nuxt 3 在服務器和客戶端都會執行代碼
- `window` 對象只在客戶端存在
- `process.client` 確保代碼只在客戶端執行

### 3. 類型安全

TypeScript 完整支持：

```typescript
// 定義類型
interface Todo {
  id: number
  text: string
  completed: boolean
  createdAt: string
}

// 組件 props
interface Props {
  todo: Todo
}

const props = defineProps<Props>()

// API 響應
const data = await $fetch<Todo[]>('/api/todos')
```

### 4. 響應式狀態

```vue
<script setup lang="ts">
// ref - 基本類型
const count = ref(0)

// reactive - 對象類型
const state = reactive({
  todos: [],
  filter: 'all'
})

// computed - 計算屬性
const filteredTodos = computed(() => {
  return state.todos.filter(/* ... */)
})

// watch - 監聽變化
watch(() => state.filter, (newValue) => {
  console.log('Filter changed:', newValue)
})
</script>
```

## 開發指南

### 安裝依賴

```bash
npm install
```

### 開發模式

```bash
npm run dev
```

訪問：http://localhost:3000

**開發模式特性：**
- 🔥 熱模塊替換（HMR）
- ⚡️ 快速刷新
- 🐛 DevTools 集成
- 📊 性能分析

### 生產構建

```bash
# 構建應用
npm run build

# 預覽生產版本
npm run preview
```

### 靜態生成（可選）

```bash
# 生成靜態站點
npm run generate
```

生成的靜態文件在 `.output/public/` 目錄。

## Nuxt 3 vs Next.js 14

| 特性 | Nuxt 3 | Next.js 14 |
|------|--------|-----------|
| **框架基礎** | Vue 3 | React 18 |
| **Auto Imports** | ✅ 默認啟用 | ❌ 需要配置 |
| **文件系統路由** | pages/ | app/ (App Router) |
| **Server API** | server/api/ | app/api/*/route.ts |
| **組件語法** | SFC (Single File Component) | JSX/TSX |
| **狀態管理** | ref/reactive | useState |
| **數據獲取** | useFetch/useAsyncData | fetch with cache |
| **Server Components** | ❌ | ✅ |
| **TypeScript** | ✅ | ✅ |

**選擇建議：**
- 喜歡 Vue？→ Nuxt 3
- 喜歡 React？→ Next.js
- 需要 Auto Imports？→ Nuxt 3
- 需要 Server Components？→ Next.js

## 架構優勢

### 1. 全棧開發體驗

```
Frontend (Vue Components)
     ↓
$fetch / useFetch
     ↓
Server API (server/api/)
     ↓
Data Layer (File System / Database)
```

**優勢：**
- 單一代碼庫
- 共享類型定義
- 統一的構建流程
- 簡化的部署

### 2. 自動優化

Nuxt 3 自動進行多項優化：

```typescript
// 自動代碼分割
// 自動導入優化
// 自動預加載
// 自動資源優化
```

**優化項目：**
- 📦 代碼分割（按路由）
- 🖼️ 圖片優化（使用 Nuxt Image）
- 🔤 字體優化
- 📝 Script 優化
- 🗜️ 壓縮和最小化

### 3. 模塊生態系統

Nuxt 3 有豐富的模塊生態：

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  modules: [
    '@nuxtjs/tailwindcss',  // Tailwind CSS
    '@pinia/nuxt',          // 狀態管理
    '@nuxt/image',          // 圖片優化
    '@nuxtjs/i18n',         // 國際化
    // ... 更多
  ]
})
```

## 性能最佳實踐

### 1. 使用 useFetch 而非 $fetch

```typescript
// ✅ 推薦：useFetch（SSR 友好，自動處理狀態）
const { data } = await useFetch('/api/todos')

// ⚠️ 僅在客戶端：$fetch（適合事件處理）
async function handleSubmit() {
  await $fetch('/api/todos', { method: 'POST', body: { ... } })
}
```

### 2. 合理使用 process.client/process.server

```typescript
// 僅在客戶端執行
if (process.client) {
  window.addEventListener('resize', handleResize)
}

// 僅在服務器端執行
if (process.server) {
  console.log('This only logs on server')
}
```

### 3. 使用 lazy 屬性延遲加載

```typescript
// 延遲加載數據（不阻塞導航）
const { data } = await useFetch('/api/todos', {
  lazy: true
})
```

### 4. 緩存策略

```typescript
// 緩存數據
const { data } = await useFetch('/api/todos', {
  key: 'todos',
  getCachedData: (key) => {
    return useNuxtData(key).data.value
  }
})
```

## 部署

### Vercel / Netlify（推薦）

```bash
# 安裝 CLI
npm i -g vercel

# 部署
vercel
```

### Node.js 服務器

```bash
# 構建
npm run build

# 啟動
node .output/server/index.mjs
```

### 靜態托管（SSG）

```bash
# 生成靜態站點
npm run generate

# 部署 .output/public/ 到任何靜態托管
```

### Docker

```dockerfile
FROM node:18-alpine

WORKDIR /app
COPY . .

RUN npm install
RUN npm run build

ENV HOST=0.0.0.0
ENV PORT=3000

CMD ["node", ".output/server/index.mjs"]
```

## 擴展建議

### 1. 數據庫集成

```typescript
// server/api/todos.ts
import { db } from '~/server/db'

export default defineEventHandler(async (event) => {
  if (event.method === 'GET') {
    const todos = await db.select().from('todos')
    return todos
  }
})
```

**推薦數據庫方案：**
- **Prisma** - ORM
- **Drizzle** - 輕量級 ORM
- **Supabase** - Backend as a Service
- **MongoDB** - NoSQL

### 2. 狀態管理（Pinia）

```bash
npm install pinia @pinia/nuxt
```

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  modules: ['@pinia/nuxt']
})
```

```typescript
// stores/todos.ts
export const useTodoStore = defineStore('todos', () => {
  const todos = ref<Todo[]>([])

  async function fetchTodos() {
    const data = await $fetch('/api/todos')
    todos.value = data
  }

  return { todos, fetchTodos }
})
```

### 3. 認證

```typescript
// server/api/auth/login.post.ts
export default defineEventHandler(async (event) => {
  const { username, password } = await readBody(event)

  // 驗證邏輯...

  // 設置 session
  await setUserSession(event, {
    user: { id: user.id, username: user.username }
  })

  return { success: true }
})
```

**推薦方案：**
- **Nuxt Auth** - 官方認證模塊
- **Supabase Auth**
- **Auth0**

### 4. 實時功能

```typescript
// composables/useWebSocket.ts
export function useWebSocket(url: string) {
  const data = ref(null)
  let ws: WebSocket

  onMounted(() => {
    if (process.client) {
      ws = new WebSocket(url)
      ws.onmessage = (event) => {
        data.value = JSON.parse(event.data)
      }
    }
  })

  onUnmounted(() => {
    ws?.close()
  })

  return { data }
}
```

### 5. UI 框架集成

```bash
# Tailwind CSS
npm install -D @nuxtjs/tailwindcss

# Vuetify
npm install -D vuetify

# Element Plus
npm install -D element-plus
```

## Composables（組合式函數）

創建可重用的邏輯：

```typescript
// composables/useTodos.ts
export function useTodos() {
  const todos = ref<Todo[]>([])
  const isLoading = ref(false)

  async function fetchTodos() {
    isLoading.value = true
    try {
      const data = await $fetch('/api/todos')
      todos.value = data
    } finally {
      isLoading.value = false
    }
  }

  async function addTodo(text: string) {
    await $fetch('/api/todos', {
      method: 'POST',
      body: { text }
    })
    await fetchTodos()
  }

  return {
    todos,
    isLoading,
    fetchTodos,
    addTodo
  }
}
```

使用：

```vue
<script setup lang="ts">
const { todos, isLoading, fetchTodos, addTodo } = useTodos()

onMounted(() => {
  fetchTodos()
})
</script>
```

## 學習資源

### 官方文檔
- [Nuxt 3 文檔](https://nuxt.com)
- [Vue 3 文檔](https://vuejs.org)
- [Nitro 引擎](https://nitro.unjs.io)

### 視頻教程
- [Nuxt 3 從入門到精通](https://www.youtube.com/watch?v=...)
- [Vue 3 Composition API](https://www.youtube.com/watch?v=...)

### 社區資源
- [Nuxt Discord](https://discord.com/invite/nuxt)
- [Vue Discord](https://discord.com/invite/vue)
- [GitHub Discussions](https://github.com/nuxt/nuxt/discussions)

## 常見問題

### 1. 為什麼使用 `process.client`？

```typescript
// ❌ 錯誤：window 在服務器端不存在
window.addEventListener('resize', handleResize)

// ✅ 正確：檢查環境
if (process.client) {
  window.addEventListener('resize', handleResize)
}
```

### 2. `useFetch` vs `$fetch` 的區別？

- **useFetch**：組件中使用，SSR 友好，自動處理狀態
- **$fetch**：事件處理、API 調用，純客戶端

### 3. 如何處理環境變量？

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  runtimeConfig: {
    apiSecret: '', // 僅服務器端
    public: {
      apiBase: '' // 客戶端和服務器端
    }
  }
})
```

```typescript
// 使用
const config = useRuntimeConfig()
console.log(config.public.apiBase)
```

### 4. 如何優化首屏加載？

```typescript
// 使用 lazy 加載
const { data } = await useFetch('/api/todos', { lazy: true })

// 懶加載組件
const TodoList = defineAsyncComponent(() => import('~/components/TodoList.vue'))
```

## 總結

Nuxt 3 提供了一個完整且現代化的全棧解決方案：

### 核心優勢
1. **開發體驗** ⭐️⭐️⭐️⭐️⭐️
   - Auto Imports
   - 熱模塊替換
   - TypeScript 支持
   - 文件系統路由

2. **性能優化** ⭐️⭐️⭐️⭐️⭐️
   - SSR 默認啟用
   - 自動代碼分割
   - 預加載和預取
   - 構建時優化

3. **全棧能力** ⭐️⭐️⭐️⭐️⭐️
   - Server API
   - 數據庫集成
   - 認證支持
   - 中間件系統

4. **生態系統** ⭐️⭐️⭐️⭐️⭐️
   - 豐富的模塊
   - 活躍的社區
   - 詳細的文檔
   - 企業支持

### 適合誰？
- ✅ Vue.js 開發者
- ✅ 需要 SSR 的項目
- ✅ 重視開發體驗的團隊
- ✅ 全棧應用開發

### 不適合誰？
- ❌ React 生態系統的用戶（考慮 Next.js）
- ❌ 純客戶端應用（考慮 Vite）
- ❌ 極簡主義者（可能覺得功能太多）

這個 Todo List 應用展示了 Nuxt 3 的核心特性，是學習 Vue 3 全棧開發的絕佳起點！🚀
