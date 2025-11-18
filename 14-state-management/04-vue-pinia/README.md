# Vue 3 + Pinia Todo List

一個展示 Vue 3 官方推薦狀態管理解決方案的現代化 Todo List 應用程式。

## 目錄

- [技術棧](#技術棧)
- [Pinia 特色](#pinia-特色)
- [功能特色](#功能特色)
- [快速開始](#快速開始)
- [專案結構](#專案結構)
- [核心概念](#核心概念)
- [Pinia vs Vuex](#pinia-vs-vuex)
- [最佳實踐](#最佳實踐)
- [學習資源](#學習資源)

## 技術棧

- **Vue 3.4+** - 漸進式 JavaScript 框架
- **Pinia 2.1+** - Vue 3 官方狀態管理庫
- **TypeScript** - 類型安全
- **Vite 5** - 極速開發構建工具
- **Composition API** - Vue 3 組合式 API

## Pinia 特色

### 為什麼選擇 Pinia？

Pinia 是 Vue 3 的官方狀態管理庫，由 Vue.js 核心團隊成員開發，是 Vuex 的繼任者。

#### 1. 簡潔的 API

```typescript
// Pinia - 使用 Composition API 風格
export const useTodoStore = defineStore('todo', () => {
  // State
  const todos = ref<Todo[]>([])

  // Getters
  const completedTodos = computed(() =>
    todos.value.filter(t => t.completed)
  )

  // Actions
  function addTodo(text: string) {
    todos.value.push({ text, completed: false })
  }

  return { todos, completedTodos, addTodo }
})
```

#### 2. 無需 Mutations

Pinia 移除了 Vuex 的 mutations 概念，可以直接在 actions 中修改 state：

```typescript
// ✅ Pinia - 直接修改
function addTodo(text: string) {
  todos.value.push({ text, completed: false })
}

// ❌ Vuex - 需要通過 mutation
mutations: {
  ADD_TODO(state, todo) {
    state.todos.push(todo)
  }
},
actions: {
  addTodo({ commit }, text) {
    commit('ADD_TODO', { text, completed: false })
  }
}
```

#### 3. 完美的 TypeScript 支持

```typescript
// 自動類型推導，無需額外配置
const todoStore = useTodoStore()
todoStore.todos // ✅ 自動推導為 Todo[]
todoStore.addTodo('test') // ✅ 完整的類型檢查和提示
```

#### 4. 模塊化設計

```typescript
// 每個 store 都是獨立的，不需要嵌套模組
import { useTodoStore } from '@/stores/useTodoStore'
import { useUserStore } from '@/stores/useUserStore'

const todoStore = useTodoStore()
const userStore = useUserStore()
```

#### 5. 插件系統

```typescript
// 輕鬆實現 localStorage 持久化
export function piniaLocalStoragePlugin(context: PiniaPluginContext) {
  // 自動保存和載入 state
  watch(() => context.store.$state, (state) => {
    localStorage.setItem(key, JSON.stringify(state))
  }, { deep: true })
}

pinia.use(piniaLocalStoragePlugin)
```

#### 6. DevTools 支持

- 自動追蹤所有 state 變化
- 時間旅行調試
- Action 歷史記錄
- 熱模塊替換（HMR）
- 無需額外配置

## 功能特色

### 核心功能

- ✅ **新增待辦事項** - 輸入並添加新的任務
- ✅ **編輯待辦事項** - 雙擊編輯現有任務
- ✅ **刪除待辦事項** - 移除不需要的任務
- ✅ **切換完成狀態** - 標記任務為完成/未完成
- ✅ **篩選功能** - 顯示全部/進行中/已完成任務
- ✅ **全選/取消全選** - 批量操作
- ✅ **清除已完成** - 一鍵清除所有已完成任務
- ✅ **實時統計** - 顯示總數、進行中、已完成數量
- ✅ **完成率進度條** - 視覺化顯示完成進度
- ✅ **LocalStorage 持久化** - 使用 Pinia Plugin 實現自動保存

### UI/UX 特性

- 🎨 現代化漸變設計
- 📱 響應式佈局
- ✨ 流暢的動畫效果
- 🎯 直觀的操作體驗
- 🌈 狀態視覺化反饋

## 快速開始

### 前置要求

- Node.js 16+
- npm 或 yarn 或 pnpm

### 安裝依賴

```bash
npm install
```

### 開發模式

```bash
npm run dev
```

應用將在 http://localhost:3004 運行

### 構建生產版本

```bash
npm run build
```

### 類型檢查

```bash
npm run type-check
```

### 預覽生產構建

```bash
npm run preview
```

## 專案結構

```
04-vue-pinia/
├── src/
│   ├── components/           # Vue 組件
│   │   ├── TodoInput.vue    # 輸入組件
│   │   ├── TodoItem.vue     # 單個待辦事項組件
│   │   ├── TodoList.vue     # 列表組件
│   │   ├── TodoFilter.vue   # 篩選器組件
│   │   └── TodoStats.vue    # 統計組件
│   ├── stores/              # Pinia Stores
│   │   └── useTodoStore.ts  # Todo Store (Composition API 風格)
│   ├── plugins/             # Pinia Plugins
│   │   └── piniaLocalStorage.ts  # localStorage 持久化插件
│   ├── App.vue              # 主應用組件
│   ├── main.ts              # 應用入口
│   ├── types.ts             # TypeScript 類型定義
│   ├── style.css            # 全局樣式
│   └── vite-env.d.ts        # Vite 類型聲明
├── index.html               # HTML 入口
├── package.json             # 項目配置
├── tsconfig.json            # TypeScript 配置
├── vite.config.ts           # Vite 配置
└── README.md                # 項目文檔
```

## 核心概念

### 1. Pinia Store 結構

Pinia 提供兩種定義 store 的方式：

#### Setup Store（推薦）

```typescript
export const useTodoStore = defineStore('todo', () => {
  // State - 使用 ref()
  const todos = ref<Todo[]>([])
  const filter = ref<FilterType>('all')

  // Getters - 使用 computed()
  const filteredTodos = computed(() => {
    return filter.value === 'all'
      ? todos.value
      : todos.value.filter(t => t.completed === (filter.value === 'completed'))
  })

  // Actions - 使用普通函數
  function addTodo(text: string) {
    todos.value.push({
      id: Date.now(),
      text,
      completed: false
    })
  }

  // 返回需要暴露的內容
  return { todos, filter, filteredTodos, addTodo }
})
```

**優勢：**
- 與 Vue 3 Composition API 完全一致
- 更靈活的代碼組織
- 更好的 TypeScript 類型推導
- 可以使用任何 Composition API 功能

#### Options Store

```typescript
export const useTodoStore = defineStore('todo', {
  state: () => ({
    todos: [] as Todo[],
    filter: 'all' as FilterType
  }),

  getters: {
    filteredTodos(state) {
      return state.filter === 'all'
        ? state.todos
        : state.todos.filter(t => t.completed === (state.filter === 'completed'))
    }
  },

  actions: {
    addTodo(text: string) {
      this.todos.push({
        id: Date.now(),
        text,
        completed: false
      })
    }
  }
})
```

**優勢：**
- 熟悉的 Options API 風格
- 與 Vuex 類似的結構
- 適合從 Vuex 遷移

### 2. 使用 Store

```vue
<script setup lang="ts">
import { useTodoStore } from '@/stores/useTodoStore'
import { storeToRefs } from 'pinia'

const todoStore = useTodoStore()

// ✅ 使用 storeToRefs 解構 state 和 getters，保持響應性
const { todos, filteredTodos, stats } = storeToRefs(todoStore)

// ✅ Actions 可以直接解構（不需要 storeToRefs）
const { addTodo, toggleTodo, removeTodo } = todoStore

// ❌ 錯誤：直接解構會失去響應性
const { todos } = todoStore // ❌ 不是響應式的

// ✅ 或者直接使用 store 實例
todoStore.todos // ✅ 響應式
</script>
```

### 3. Pinia Plugins

本專案實現了一個 localStorage 持久化插件：

```typescript
export function piniaLocalStoragePlugin(context: PiniaPluginContext) {
  const { store, options } = context

  // 從 localStorage 載入
  const savedState = loadState(key)
  if (savedState) {
    store.$patch(savedState)
  }

  // 監聽變化並保存
  watch(
    () => store.$state,
    (state) => saveState(key, state),
    { deep: true }
  )
}

// 使用插件
const pinia = createPinia()
pinia.use(piniaLocalStoragePlugin)
```

**特點：**
- 自動序列化/反序列化（支持 Date 對象）
- 支持選擇性持久化
- 錯誤處理
- 可配置存儲 key

## Pinia vs Vuex

### 核心差異對比

| 特性 | Pinia | Vuex |
|------|-------|------|
| **Mutations** | ❌ 不需要 | ✅ 必須 |
| **TypeScript** | 🟢 優秀（自動推導） | 🟡 需要額外配置 |
| **DevTools** | 🟢 自動支持 | 🟢 需要配置 |
| **模塊化** | 🟢 扁平化、自動分割 | 🟡 嵌套模塊 |
| **代碼量** | 🟢 更少（-40%） | 🟡 較多 |
| **學習曲線** | 🟢 簡單 | 🟡 陡峭 |
| **Bundle Size** | 🟢 ~1KB | 🟡 ~3KB |
| **Vue 版本** | Vue 3 優先 | Vue 2 & 3 |
| **官方推薦** | ✅ Vue 3 官方推薦 | 維護模式 |

### 代碼量對比

#### 新增一個功能

**Pinia:**
```typescript
// 只需添加一個 action
function removeTodo(id: number) {
  const index = todos.value.findIndex(todo => todo.id === id)
  if (index !== -1) {
    todos.value.splice(index, 1)
  }
}
```

**Vuex:**
```typescript
// 需要添加 mutation + action
mutations: {
  REMOVE_TODO(state, id) {
    const index = state.todos.findIndex(todo => todo.id === id)
    if (index !== -1) {
      state.todos.splice(index, 1)
    }
  }
},
actions: {
  removeTodo({ commit }, id) {
    commit('REMOVE_TODO', id)
  }
}
```

### 遷移指南

從 Vuex 遷移到 Pinia：

```typescript
// Vuex
export default {
  state: () => ({ count: 0 }),
  mutations: {
    INCREMENT(state) { state.count++ }
  },
  actions: {
    increment({ commit }) { commit('INCREMENT') }
  },
  getters: {
    double(state) { return state.count * 2 }
  }
}

// Pinia (Setup Store)
export const useCounterStore = defineStore('counter', () => {
  const count = ref(0)
  const double = computed(() => count.value * 2)
  function increment() { count.value++ }
  return { count, double, increment }
})
```

### 何時使用哪個？

**選擇 Pinia：**
- ✅ 開始新的 Vue 3 項目
- ✅ 想要更好的 TypeScript 支持
- ✅ 偏好 Composition API 風格
- ✅ 需要更簡潔的 API
- ✅ 重視開發體驗

**選擇 Vuex：**
- ✅ 維護現有的大型 Vue 2 項目
- ✅ 團隊已經熟悉 Vuex
- ✅ 需要向後兼容

## 最佳實踐

### 1. Store 組織

```typescript
// ✅ 好的實踐：每個領域一個 store
stores/
  ├── useTodoStore.ts      // Todo 相關狀態
  ├── useUserStore.ts      // 用戶相關狀態
  └── useSettingsStore.ts  // 設置相關狀態

// ❌ 避免：所有狀態放在一個大的 store 中
```

### 2. 使用 storeToRefs

```typescript
// ✅ 正確：使用 storeToRefs 保持響應性
import { storeToRefs } from 'pinia'

const todoStore = useTodoStore()
const { todos, filteredTodos } = storeToRefs(todoStore)
const { addTodo, removeTodo } = todoStore

// ❌ 錯誤：直接解構會失去響應性
const { todos } = todoStore
```

### 3. 類型安全

```typescript
// ✅ 定義明確的類型
interface Todo {
  id: number
  text: string
  completed: boolean
  createdAt: Date
}

type FilterType = 'all' | 'active' | 'completed'

// 在 store 中使用
const todos = ref<Todo[]>([])
const filter = ref<FilterType>('all')
```

### 4. Action 命名

```typescript
// ✅ 使用動詞開頭，描述性的名稱
function addTodo(text: string) { }
function removeTodo(id: number) { }
function toggleTodo(id: number) { }
function updateTodo(id: number, text: string) { }
function clearCompleted() { }

// ❌ 避免：不清晰的名稱
function doSomething() { }
function handler() { }
```

### 5. Getter 的使用

```typescript
// ✅ Getter 應該是純函數，沒有副作用
const completedTodos = computed(() =>
  todos.value.filter(t => t.completed)
)

// ❌ 避免：在 getter 中修改 state
const completedTodos = computed(() => {
  todos.value = todos.value.sort() // ❌ 不要這樣做
  return todos.value.filter(t => t.completed)
})
```

### 6. 插件使用

```typescript
// ✅ 在 store 定義中配置插件選項
export const useTodoStore = defineStore('todo', () => {
  // ... store 實現
}, {
  persist: {
    key: 'vue-pinia-todos',
    paths: ['todos', 'nextId']  // 只持久化需要的字段
  }
})
```

## 學習資源

### 官方文檔

- [Pinia 官方文檔](https://pinia.vuejs.org/) - 完整的 API 參考和指南
- [Vue 3 文檔](https://vuejs.org/) - Vue 3 官方文檔
- [Composition API](https://vuejs.org/guide/extras/composition-api-faq.html) - Composition API FAQ

### 推薦閱讀

#### Pinia 基礎
- [為什麼選擇 Pinia？](https://pinia.vuejs.org/introduction.html#why-should-i-use-pinia)
- [開始使用 Pinia](https://pinia.vuejs.org/getting-started.html)
- [定義 Store](https://pinia.vuejs.org/core-concepts/)

#### 進階主題
- [Pinia Plugins](https://pinia.vuejs.org/core-concepts/plugins.html)
- [從 Vuex 遷移](https://pinia.vuejs.org/cookbook/migration-vuex.html)
- [測試 Stores](https://pinia.vuejs.org/cookbook/testing.html)
- [TypeScript 支持](https://pinia.vuejs.org/cookbook/typescript.html)

#### 對比文章
- [Pinia vs Vuex](https://pinia.vuejs.org/introduction.html#comparison-with-vuex)
- [Pinia vs Redux](https://pinia.vuejs.org/introduction.html#comparison-with-vuex-3-x4-x)

### 視頻教程

- [Pinia 完整教程](https://www.youtube.com/results?search_query=pinia+tutorial)
- [Vue 3 狀態管理](https://www.youtube.com/results?search_query=vue+3+state+management)

### 相關工具

- [Vue DevTools](https://devtools.vuejs.org/) - Vue 開發者工具
- [Vite](https://vitejs.dev/) - 下一代前端構建工具
- [TypeScript](https://www.typescriptlang.org/) - JavaScript 的超集

## 技術亮點

### 1. Composition API 風格

使用 Setup Store 語法，與 Vue 3 Composition API 完美整合：

```typescript
export const useTodoStore = defineStore('todo', () => {
  // 就像在 <script setup> 中編寫組件一樣
  const state = ref(...)
  const computed = computed(...)
  function action() { }

  return { state, computed, action }
})
```

### 2. TypeScript 完整支持

無需額外配置，自動類型推導：

```typescript
const todoStore = useTodoStore()
todoStore.todos // ✅ 自動推導為 Todo[]
todoStore.addTodo('test') // ✅ 完整的類型檢查
```

### 3. 模塊化設計

扁平化的 store 結構，易於維護和擴展：

```typescript
// 每個 store 都是獨立的
import { useTodoStore } from '@/stores/useTodoStore'
import { useUserStore } from '@/stores/useUserStore'

// 在 store 之間也可以互相調用
export const useTodoStore = defineStore('todo', () => {
  const userStore = useUserStore()
  // ...
})
```

### 4. DevTools 整合

自動支持 Vue DevTools，無需額外配置：
- 追蹤所有 state 變化
- 時間旅行調試
- Action 歷史記錄

### 5. 輕量高效

- Bundle size 僅 ~1KB（gzipped）
- Tree-shaking 友好
- 運行時性能優秀

### 6. 插件系統

通過插件擴展功能：
- localStorage 持久化
- 狀態同步
- 日誌記錄
- 等等...

## 常見問題

### Q: Pinia 和 Vuex 可以一起使用嗎？

A: 可以，但不推薦。在遷移期間可以並存，但最終應該完全遷移到 Pinia。

### Q: Pinia 支持 Vue 2 嗎？

A: 支持！Pinia 2 同時支持 Vue 2 和 Vue 3，但在 Vue 3 中體驗最佳。

### Q: 如何在組件外使用 store？

A: 確保在 Pinia 實例創建之後調用：

```typescript
// main.ts
const pinia = createPinia()
app.use(pinia)

// 之後可以在任何地方使用
import { useTodoStore } from '@/stores/useTodoStore'

export function someUtility() {
  const todoStore = useTodoStore()
  // ...
}
```

### Q: Pinia 支持 SSR 嗎？

A: 完全支持！Pinia 為 SSR 場景提供了完整的解決方案。

### Q: 如何重置 store 到初始狀態？

A: 使用 `$reset()` 方法：

```typescript
const todoStore = useTodoStore()
todoStore.$reset() // 重置到初始狀態
```

### Q: 如何訂閱 state 變化？

A: 使用 `$subscribe()` 方法：

```typescript
todoStore.$subscribe((mutation, state) => {
  console.log('State changed:', state)
})
```

## 總結

### Pinia 的優勢

- ✅ **更簡單** - 無需 mutations，API 更直觀
- ✅ **更輕量** - Bundle size 減少 66%
- ✅ **更好的 TypeScript** - 完整的類型推導
- ✅ **更易維護** - 扁平化結構，代碼量更少
- ✅ **官方推薦** - Vue 3 官方狀態管理方案
- ✅ **開發體驗好** - 與 Composition API 完美整合
- ✅ **靈活的插件系統** - 易於擴展

### 適用場景

- 🎯 中小型到大型 Vue 3 應用
- 🎯 需要狀態共享的多組件應用
- 🎯 TypeScript 項目
- 🎯 Composition API 風格的項目
- 🎯 需要模塊化狀態管理的應用

### 學習建議

1. **先掌握基礎** - 理解 state、getters、actions 的概念
2. **實踐 Composition API** - Setup Store 語法與 Composition API 一致
3. **學習 TypeScript** - Pinia 與 TypeScript 配合最佳
4. **使用 DevTools** - 利用 Vue DevTools 調試
5. **探索插件** - 了解如何擴展 Pinia 功能

## License

MIT

---

**Made with ♥ using Vue 3 + Pinia**
