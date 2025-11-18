# 快速啟動指南

## 🚀 開始使用

### 1. 安裝依賴
```bash
cd 14-state-management/07-vue-pinia
npm install
```

### 2. 啟動開發服務器
```bash
npm run dev
```

應用將在 http://localhost:3007 上運行

### 3. 構建生產版本
```bash
npm run build
```

## 📁 項目結構

```
07-vue-pinia/
├── src/
│   ├── components/          # Vue 組件
│   │   ├── TodoInput.vue    # 輸入框組件
│   │   ├── TodoItem.vue     # 單個待辦事項
│   │   ├── TodoList.vue     # 待辦事項列表
│   │   ├── TodoFilter.vue   # 篩選器
│   │   └── TodoStats.vue    # 統計資訊
│   ├── stores/              # Pinia Stores
│   │   └── useTodoStore.ts  # Todo 狀態管理
│   ├── App.vue             # 主應用
│   ├── main.ts             # 入口文件
│   ├── types.ts            # TypeScript 類型
│   └── style.css           # 全局樣式
├── index.html              # HTML 模板
├── package.json            # 依賴配置
├── vite.config.ts          # Vite 配置
└── tsconfig.json           # TypeScript 配置
```

## 🎯 核心特性

### Pinia Store（Composition API 風格）

```typescript
// src/stores/useTodoStore.ts
export const useTodoStore = defineStore('todo', () => {
  // State
  const todos = ref<Todo[]>([])
  const filter = ref<FilterType>('all')

  // Getters
  const filteredTodos = computed(() => {
    // 自動過濾邏輯
  })

  // Actions
  function addTodo(text: string) {
    // 直接修改 state，無需 mutations
    todos.value.push({ ... })
  }

  return { todos, filter, filteredTodos, addTodo }
})
```

### 在組件中使用

```vue
<script setup lang="ts">
import { useTodoStore } from '@/stores/useTodoStore'
import { storeToRefs } from 'pinia'

const todoStore = useTodoStore()
const { todos, filteredTodos } = storeToRefs(todoStore)
const { addTodo, toggleTodo } = todoStore
</script>
```

## 🔑 關鍵概念

### 1. Setup Store 語法
- 類似 Composition API
- 使用 `ref` 創建 state
- 使用 `computed` 創建 getters
- 普通函數作為 actions

### 2. 無需 Mutations
- 直接在 actions 中修改 state
- 更簡潔的代碼
- 更好的 TypeScript 支持

### 3. 自動響應式
- 使用 `storeToRefs` 保持響應性
- Actions 可以直接解構
- 完整的 DevTools 支持

## 💡 最佳實踐

1. **使用 storeToRefs**
   ```typescript
   // ✅ 正確
   const { todos } = storeToRefs(todoStore)

   // ❌ 錯誤（失去響應性）
   const { todos } = todoStore
   ```

2. **Actions 可以直接解構**
   ```typescript
   // ✅ 正確
   const { addTodo } = todoStore
   ```

3. **TypeScript 類型推導**
   ```typescript
   // 自動推導類型，無需手動聲明
   const todoStore = useTodoStore()
   ```

## 🎨 功能演示

- 新增待辦事項
- 雙擊編輯事項
- 點擊勾選框標記完成
- 篩選：全部/進行中/已完成
- 全選/取消全選
- 清除已完成事項
- 實時統計資訊
- LocalStorage 自動保存

## 📚 更多資訊

詳見 [README.md](./README.md) 了解 Pinia vs Vuex 的詳細對比。
