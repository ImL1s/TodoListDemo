# Vue 3 + Pinia Todo List

使用 Vue 3 和 Pinia 構建的現代化 Todo List 應用程序，展示 Vue 3 官方推薦的狀態管理解決方案。

## 技術棧

- **Vue 3.4+** - 漸進式 JavaScript 框架
- **Pinia 2.1+** - Vue 3 官方狀態管理庫
- **TypeScript** - 類型安全
- **Vite 5** - 快速的開發構建工具
- **Composition API** - Vue 3 組合式 API

## 功能特色

### 核心功能
- ✅ 新增、編輯、刪除待辦事項
- ✅ 標記完成/未完成
- ✅ 篩選（全部/進行中/已完成）
- ✅ 全選/取消全選
- ✅ 清除已完成項目
- ✅ 實時統計資訊
- ✅ 完成率進度條
- ✅ LocalStorage 持久化

### UI/UX 特性
- 🎨 現代化漸變設計
- 📱 響應式佈局
- ✨ 流暢的動畫效果
- 🎯 直觀的操作體驗
- 🌈 狀態視覺化反饋

## Pinia vs Vuex 詳細對比

### 1. API 設計

#### Pinia（更簡潔）
```typescript
// Setup Store 風格 - 類似 Composition API
export const useTodoStore = defineStore('todo', () => {
  const todos = ref<Todo[]>([])

  const filteredTodos = computed(() => {
    // getter 邏輯
  })

  function addTodo(text: string) {
    // action 邏輯
  }

  return { todos, filteredTodos, addTodo }
})
```

#### Vuex（傳統）
```typescript
// 需要明確區分 state, getters, mutations, actions
export default {
  state: () => ({
    todos: []
  }),
  getters: {
    filteredTodos(state) {
      // getter 邏輯
    }
  },
  mutations: {
    ADD_TODO(state, text) {
      // mutation 邏輯
    }
  },
  actions: {
    addTodo({ commit }, text) {
      commit('ADD_TODO', text)
    }
  }
}
```

### 2. 核心差異對比表

| 特性 | Pinia | Vuex |
|------|-------|------|
| **Mutations** | ❌ 不需要（直接修改 state） | ✅ 必須（同步修改） |
| **命名約定** | 自由命名 | 需要常量/大寫命名 |
| **TypeScript** | 🟢 優秀（自動推導） | 🟡 需要額外配置 |
| **DevTools** | 🟢 自動支持 | 🟢 需要配置 |
| **模塊化** | 🟢 扁平化、自動分割 | 🟡 嵌套模塊、需要 namespaced |
| **代碼量** | 🟢 更少（約 -40%） | 🟡 較多 |
| **學習曲線** | 🟢 簡單（類似 Composition API） | 🟡 陡峭（新概念多） |
| **Bundle Size** | 🟢 ~1KB | 🟡 ~3KB |
| **Vue 版本** | Vue 3 優先（也支持 Vue 2） | Vue 2 & 3 |
| **官方推薦** | ✅ Vue 3 官方推薦 | 維護模式 |

### 3. 詳細特性對比

#### 🎯 沒有 Mutations

**Pinia：**
```typescript
// 直接在 action 中修改 state
function addTodo(text: string) {
  todos.value.push({
    id: nextId.value++,
    text,
    completed: false
  })
}
```

**Vuex：**
```typescript
// 必須通過 mutation 修改
mutations: {
  ADD_TODO(state, todo) {
    state.todos.push(todo)
  }
},
actions: {
  addTodo({ commit, state }, text) {
    commit('ADD_TODO', {
      id: state.nextId++,
      text,
      completed: false
    })
  }
}
```

#### 🔧 TypeScript 支持

**Pinia：**
```typescript
// 自動類型推導，無需額外配置
const todoStore = useTodoStore()
todoStore.addTodo('test') // ✅ 完整的類型提示
todoStore.todos // ✅ 自動推導為 Todo[]
```

**Vuex：**
```typescript
// 需要複雜的類型聲明
import { Store } from 'vuex'
import { RootState } from './types'

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $store: Store<RootState>
  }
}

// 使用時仍需手動類型斷言
this.$store.state.todos as Todo[]
```

#### 📦 模塊化方式

**Pinia：**
```typescript
// 每個 store 都是獨立的，自動分割
// stores/useTodoStore.ts
export const useTodoStore = defineStore('todo', ...)

// stores/useUserStore.ts
export const useUserStore = defineStore('user', ...)

// 使用時直接導入
import { useTodoStore } from '@/stores/useTodoStore'
```

**Vuex：**
```typescript
// 需要在中心註冊所有模塊
export default new Vuex.Store({
  modules: {
    todo: todoModule,
    user: userModule
  }
})

// 使用時需要模塊路徑
this.$store.dispatch('todo/addTodo', text)
```

#### 🎨 Composition API 整合

**Pinia：**
```vue
<script setup lang="ts">
// 完美整合，就像使用 composable
import { useTodoStore } from '@/stores/useTodoStore'

const todoStore = useTodoStore()

// 直接使用，支持響應式
const { todos, filteredTodos } = storeToRefs(todoStore)
</script>
```

**Vuex：**
```vue
<script setup lang="ts">
// 需要使用特殊的 composable
import { useStore } from 'vuex'
import { computed } from 'vue'

const store = useStore()

// 需要手動包裝成 computed
const todos = computed(() => store.state.todos)
</script>
```

### 4. 實際開發體驗對比

#### 新增功能時的代碼量

**Pinia：**
```typescript
// 只需添加一個 action
function removeTodo(id: number) {
  const index = todos.value.findIndex(todo => todo.id === id)
  if (index !== -1) {
    todos.value.splice(index, 1)
  }
}
```

**Vuex：**
```typescript
// 需要添加 mutation + action + 可能的 getter
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

#### DevTools 支持

**Pinia：**
- ✅ 自動追蹤所有 state 變化
- ✅ 時間旅行調試
- ✅ Action 歷史記錄
- ✅ 熱模塊替換（HMR）
- ✅ 無需額外配置

**Vuex：**
- ✅ 完整的 DevTools 支持
- ⚠️ 需要配置 strict mode
- ⚠️ Mutations 必須是同步的

### 5. 性能對比

| 指標 | Pinia | Vuex |
|------|-------|------|
| Bundle Size | ~1KB (gzipped) | ~3KB (gzipped) |
| 運行時性能 | 稍快（少一層抽象） | 標準 |
| 開發體驗 | 更快（代碼更少） | 較慢 |
| Tree Shaking | 優秀 | 良好 |

### 6. 遷移建議

#### 從 Vuex 遷移到 Pinia

**Step 1: 安裝 Pinia**
```bash
npm install pinia
```

**Step 2: 創建 Pinia 實例**
```typescript
// main.ts
import { createPinia } from 'pinia'
app.use(createPinia())
```

**Step 3: 轉換 Store**
```typescript
// Vuex
export default {
  state: () => ({ count: 0 }),
  mutations: {
    INCREMENT(state) { state.count++ }
  },
  actions: {
    increment({ commit }) { commit('INCREMENT') }
  }
}

// Pinia
export const useCounterStore = defineStore('counter', () => {
  const count = ref(0)
  function increment() { count.value++ }
  return { count, increment }
})
```

### 7. 何時使用哪個？

#### 選擇 Pinia 如果：
- ✅ 開始新的 Vue 3 項目
- ✅ 想要更好的 TypeScript 支持
- ✅ 偏好 Composition API 風格
- ✅ 需要更簡潔的 API
- ✅ 團隊成員熟悉 React Hooks 或 Composition API

#### 選擇 Vuex 如果：
- ✅ 維護現有的大型 Vue 2 項目
- ✅ 需要時間旅行調試的嚴格模式
- ✅ 團隊已經熟悉 Vuex 模式
- ✅ 需要向後兼容

### 8. 最佳實踐

#### Pinia 最佳實踐

```typescript
// ✅ 使用 Setup Store 語法（推薦）
export const useTodoStore = defineStore('todo', () => {
  // state
  const todos = ref<Todo[]>([])

  // getters
  const completedTodos = computed(() =>
    todos.value.filter(t => t.completed)
  )

  // actions
  function addTodo(text: string) {
    todos.value.push({ text, completed: false })
  }

  return { todos, completedTodos, addTodo }
})

// ✅ 使用 storeToRefs 保持響應性
import { storeToRefs } from 'pinia'
const { todos } = storeToRefs(todoStore)

// ❌ 避免解構（會失去響應性）
const { todos } = todoStore // ❌ 不是響應式的

// ✅ Actions 可以直接解構
const { addTodo } = todoStore // ✅ 正確
```

## 項目結構

```
07-vue-pinia/
├── src/
│   ├── components/
│   │   ├── TodoInput.vue      # 輸入組件
│   │   ├── TodoItem.vue       # 單個事項組件
│   │   ├── TodoList.vue       # 列表組件
│   │   ├── TodoFilter.vue     # 篩選器組件
│   │   └── TodoStats.vue      # 統計組件
│   ├── stores/
│   │   └── useTodoStore.ts    # Pinia Store（Composition API 風格）
│   ├── App.vue                # 主應用組件
│   ├── main.ts                # 入口文件
│   ├── types.ts               # TypeScript 類型定義
│   └── style.css              # 全局樣式
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

## 快速開始

### 安裝依賴

```bash
npm install
```

### 開發模式

```bash
npm run dev
```

訪問 http://localhost:3007

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

## Pinia Store 設計

### Store 結構（Setup Store 風格）

```typescript
export const useTodoStore = defineStore('todo', () => {
  // 1️⃣ State（使用 ref）
  const todos = ref<Todo[]>([])
  const filter = ref<FilterType>('all')

  // 2️⃣ Getters（使用 computed）
  const filteredTodos = computed(() => {
    switch (filter.value) {
      case 'active': return todos.value.filter(t => !t.completed)
      case 'completed': return todos.value.filter(t => t.completed)
      default: return todos.value
    }
  })

  const stats = computed(() => ({
    total: todos.value.length,
    active: todos.value.filter(t => !t.completed).length,
    completed: todos.value.filter(t => t.completed).length
  }))

  // 3️⃣ Actions（普通函數）
  function addTodo(text: string) {
    todos.value.push({
      id: nextId.value++,
      text: text.trim(),
      completed: false,
      createdAt: new Date()
    })
  }

  function toggleTodo(id: number) {
    const todo = todos.value.find(t => t.id === id)
    if (todo) todo.completed = !todo.completed
  }

  // 4️⃣ 返回公開的 API
  return {
    todos,
    filter,
    filteredTodos,
    stats,
    addTodo,
    toggleTodo
  }
})
```

### Store 特性

#### 1. 響應式狀態
- 使用 `ref` 和 `reactive` 創建響應式狀態
- 自動追蹤依賴關係
- 支持 Vue DevTools

#### 2. Computed Getters
- 使用 `computed` 創建派生狀態
- 自動緩存和重新計算
- 可組合多個 getters

#### 3. 簡化的 Actions
- 不需要 mutations
- 直接修改 state
- 支持異步操作
- 完整的 TypeScript 類型推導

#### 4. 模塊化
- 每個 store 都是獨立的模塊
- 可以在 store 中互相調用
- 自動的代碼分割

## 核心概念示例

### 1. 使用 Store

```vue
<script setup lang="ts">
import { useTodoStore } from '@/stores/useTodoStore'
import { storeToRefs } from 'pinia'

const todoStore = useTodoStore()

// 使用 storeToRefs 保持響應性
const { todos, filteredTodos, stats } = storeToRefs(todoStore)

// Actions 可以直接解構
const { addTodo, toggleTodo } = todoStore
</script>
```

### 2. 數據持久化

```typescript
// 監聽變化並保存
watch(
  () => todoStore.todos,
  () => todoStore.saveToStorage(),
  { deep: true }
)

// 初始化時載入
onMounted(() => {
  todoStore.loadFromStorage()
})
```

### 3. TypeScript 集成

```typescript
// 完整的類型支持
interface Todo {
  id: number
  text: string
  completed: boolean
  createdAt: Date
}

type FilterType = 'all' | 'active' | 'completed'

// Store 自動推導類型
const todoStore = useTodoStore()
todoStore.addTodo('test') // ✅ 類型檢查
todoStore.todos // ✅ 推導為 Todo[]
```

## 學習資源

### 官方文檔
- [Pinia 官方文檔](https://pinia.vuejs.org/)
- [Vue 3 文檔](https://vuejs.org/)
- [Composition API](https://vuejs.org/guide/extras/composition-api-faq.html)

### 推薦閱讀
- [為什麼選擇 Pinia？](https://pinia.vuejs.org/introduction.html#why-should-i-use-pinia)
- [從 Vuex 遷移到 Pinia](https://pinia.vuejs.org/cookbook/migration-vuex.html)
- [Pinia vs Vuex](https://pinia.vuejs.org/introduction.html#comparison-with-vuex)

## 技術亮點

1. **Composition API 風格** - Setup Store 語法，與 Vue 3 完美整合
2. **TypeScript 完整支持** - 自動類型推導，無需額外配置
3. **模塊化設計** - 扁平化的 store 結構，易於維護
4. **DevTools 整合** - 自動支持 Vue DevTools
5. **輕量高效** - 僅 ~1KB，Tree-shaking 友好
6. **簡潔的 API** - 無需 mutations，直接修改 state

## 總結

### Pinia 的優勢
- ✅ **更簡單** - 無需 mutations，API 更直觀
- ✅ **更輕量** - Bundle size 減少 66%
- ✅ **更好的 TypeScript** - 完整的類型推導
- ✅ **更易維護** - 扁平化結構，代碼量更少
- ✅ **官方推薦** - Vue 3 官方狀態管理方案

### 適用場景
- 🎯 中小型到大型 Vue 3 應用
- 🎯 需要狀態共享的多組件應用
- 🎯 TypeScript 項目
- 🎯 Composition API 風格的項目

## License

MIT
