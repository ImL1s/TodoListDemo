# 快速開始指南

5 分鐘快速了解如何使用 Vue 3 + Pinia 構建 Todo List 應用。

## 1. 安裝依賴

```bash
npm install
```

## 2. 啟動開發服務器

```bash
npm run dev
```

訪問 http://localhost:3004

## 3. 核心代碼解析

### 定義 Store (useTodoStore.ts)

```typescript
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useTodoStore = defineStore('todo', () => {
  // State
  const todos = ref<Todo[]>([])

  // Getters
  const completedTodos = computed(() =>
    todos.value.filter(t => t.completed)
  )

  // Actions
  function addTodo(text: string) {
    todos.value.push({
      id: Date.now(),
      text,
      completed: false
    })
  }

  return { todos, completedTodos, addTodo }
})
```

### 使用 Store (App.vue)

```vue
<script setup lang="ts">
import { useTodoStore } from '@/stores/useTodoStore'
import { storeToRefs } from 'pinia'

const todoStore = useTodoStore()

// 解構 state 和 getters（需要 storeToRefs）
const { todos, completedTodos } = storeToRefs(todoStore)

// 解構 actions（不需要 storeToRefs）
const { addTodo } = todoStore
</script>

<template>
  <div>
    <h1>Todos: {{ todos.length }}</h1>
    <button @click="addTodo('New Task')">Add</button>
  </div>
</template>
```

### 註冊 Plugin (main.ts)

```typescript
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { piniaLocalStoragePlugin } from './plugins/piniaLocalStorage'

const pinia = createPinia()
pinia.use(piniaLocalStoragePlugin)

const app = createApp(App)
app.use(pinia)
app.mount('#app')
```

## 4. Pinia 核心概念

### State

使用 `ref()` 或 `reactive()` 定義響應式狀態：

```typescript
const count = ref(0)
const user = reactive({ name: 'John' })
```

### Getters

使用 `computed()` 定義派生狀態：

```typescript
const doubleCount = computed(() => count.value * 2)
```

### Actions

使用普通函數定義 actions（可以是同步或異步）：

```typescript
function increment() {
  count.value++
}

async function fetchUser() {
  const response = await api.getUser()
  user.value = response.data
}
```

## 5. 常用 API

### 訪問 Store

```typescript
const todoStore = useTodoStore()
```

### 解構保持響應性

```typescript
import { storeToRefs } from 'pinia'

const { todos, filter } = storeToRefs(todoStore)
const { addTodo, removeTodo } = todoStore
```

### 重置 Store

```typescript
todoStore.$reset()
```

### 批量更新

```typescript
todoStore.$patch({
  todos: [],
  filter: 'all'
})
```

### 訂閱變化

```typescript
todoStore.$subscribe((mutation, state) => {
  console.log('State changed:', state)
})
```

## 6. TypeScript 支持

Pinia 提供完整的 TypeScript 支持：

```typescript
interface Todo {
  id: number
  text: string
  completed: boolean
}

const todos = ref<Todo[]>([]) // ✅ 類型安全
```

## 7. DevTools

Pinia 自動支持 Vue DevTools：

1. 安裝 [Vue DevTools](https://devtools.vuejs.org/)
2. 打開開發者工具
3. 切換到 "Pinia" 標籤
4. 查看所有 stores 和它們的狀態

## 8. 常用命令

```bash
# 開發
npm run dev

# 構建
npm run build

# 類型檢查
npm run type-check

# 預覽構建
npm run preview
```

## 9. 學習路徑

1. **基礎概念** - 理解 State、Getters、Actions
2. **Setup Store** - 學習 Composition API 風格
3. **TypeScript** - 掌握類型定義
4. **Plugins** - 了解插件系統
5. **最佳實踐** - 學習代碼組織和模式

## 10. 下一步

- 閱讀 [README.md](./README.md) 了解完整功能
- 查看 [Pinia 官方文檔](https://pinia.vuejs.org/)
- 嘗試修改代碼並添加新功能
- 探索其他狀態管理方案

## 故障排除

### 問題：狀態不更新

**解決：**確保使用 `storeToRefs` 解構 state：

```typescript
// ❌ 錯誤
const { todos } = todoStore

// ✅ 正確
const { todos } = storeToRefs(todoStore)
```

### 問題：TypeScript 報錯

**解決：**檢查類型定義是否正確：

```typescript
// 確保導入類型
import type { Todo } from '@/types'

// 使用泛型指定類型
const todos = ref<Todo[]>([])
```

### 問題：localStorage 不工作

**解決：**確保註冊了插件：

```typescript
// main.ts
import { piniaLocalStoragePlugin } from './plugins/piniaLocalStorage'

const pinia = createPinia()
pinia.use(piniaLocalStoragePlugin) // ✅ 註冊插件
```

## 有用的連結

- [Pinia 官方文檔](https://pinia.vuejs.org/)
- [Vue 3 文檔](https://vuejs.org/)
- [Vite 文檔](https://vitejs.dev/)
- [TypeScript 文檔](https://www.typescriptlang.org/)

---

Happy Coding! 🚀
