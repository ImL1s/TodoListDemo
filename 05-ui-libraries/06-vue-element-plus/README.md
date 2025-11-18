# Vue 3 + Element Plus - 待辦事項清單

一個使用 Vue 3 Composition API、Element Plus UI 庫和 TypeScript 構建的現代化待辦事項應用程序。

## 目錄

- [專案概述](#專案概述)
- [Element Plus 介紹](#element-plus-介紹)
- [技術棧](#技術棧)
- [核心功能](#核心功能)
- [專案結構](#專案結構)
- [快速開始](#快速開始)
- [組件詳解](#組件詳解)
- [Element Plus 組件使用](#element-plus-組件使用)
- [Element Plus vs Vuetify](#element-plus-vs-vuetify)
- [TypeScript 類型系統](#typescript-類型系統)
- [狀態管理](#狀態管理)
- [本地存儲](#本地存儲)
- [主題系統](#主題系統)
- [響應式設計](#響應式設計)
- [性能優化](#性能優化)
- [最佳實踐](#最佳實踐)
- [常見問題](#常見問題)
- [擴展建議](#擴展建議)

---

## 專案概述

這是一個功能完整的待辦事項管理應用，展示了如何使用 Vue 3 的 Composition API 與 Element Plus UI 庫構建現代化的 Web 應用程序。

### 主要特點

- **🎨 Element Plus UI** - 使用 Element Plus 組件庫構建精美的用戶界面
- **⚡ Vue 3 Composition API** - 使用最新的 Vue 3 Composition API 和 `<script setup>` 語法
- **📘 TypeScript** - 完整的 TypeScript 類型支持，確保類型安全
- **🌓 深色模式** - 內建深色/淺色主題切換功能
- **💾 數據持久化** - 使用 LocalStorage 自動保存待辦事項
- **📱 響應式設計** - 完美適配桌面、平板和移動設備
- **🎯 現代化架構** - 組件化設計，代碼可維護性高

### 應用截圖

```
┌─────────────────────────────────────────────────────────────┐
│  📋 待辦事項清單    [Vue 3] [Element Plus] [TypeScript]    │
│                                        ☀️ ◯───● 🌙         │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌───────────────────────────────────────────────────────┐ │
│  │ 總計: 5  │  進行中: 3  │  已完成: 2  │  完成率: 40%  │ │
│  │ ████████████░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ 40%       │ │
│  └───────────────────────────────────────────────────────┘ │
│                                                             │
│  ┌───────────────────────────────────────────────────────┐ │
│  │ ✏️  [請輸入新的待辦事項...]            [➕ 添加]      │ │
│  └───────────────────────────────────────────────────────┘ │
│                                                             │
│  ┌───────────────────────────────────────────────────────┐ │
│  │ ○ 全部(5)  ○ 進行中(3)  ○ 已完成(2)                  │ │
│  │                      [✓ 全部完成] [🗑️ 清除已完成(2)]  │ │
│  └───────────────────────────────────────────────────────┘ │
│                                                             │
│  ┌───────────────────────────────────────────────────────┐ │
│  │ 📋 待辦事項列表                          共 5 項       │ │
│  ├───────────────────────────────────────────────────────┤ │
│  │ ☑ 完成專案文檔                    [已完成] [✏️] [🗑️]  │ │
│  │   📅 2024-03-20 10:30                                 │ │
│  ├───────────────────────────────────────────────────────┤ │
│  │ ☐ 學習 Vue 3 Composition API      [進行中] [✏️] [🗑️]  │ │
│  │   📅 2024-03-20 11:15                                 │ │
│  └───────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

---

## Element Plus 介紹

### 什麼是 Element Plus？

Element Plus 是一個基於 Vue 3 的桌面端組件庫，是 Element UI 的 Vue 3 版本。它提供了豐富的組件和完善的設計系統，幫助開發者快速構建高質量的 Web 應用。

### Element Plus 的特點

#### 1. **Vue 3 原生支持**
```typescript
// 完全支持 Vue 3 Composition API
import { ref } from 'vue'
import { ElMessage } from 'element-plus'

const count = ref(0)

const showMessage = () => {
  ElMessage.success('操作成功！')
}
```

#### 2. **豐富的組件庫**
- **基礎組件**: Button, Icon, Link, Layout
- **表單組件**: Input, Select, Radio, Checkbox, Switch, DatePicker
- **數據展示**: Table, Tag, Progress, Tree, Pagination
- **反饋組件**: Alert, Message, MessageBox, Notification
- **導航組件**: Menu, Tabs, Breadcrumb, Dropdown
- **其他**: Dialog, Drawer, Popover, Tooltip, Upload

#### 3. **TypeScript 支持**
```typescript
// 完整的 TypeScript 類型定義
import type { FormInstance, FormRules } from 'element-plus'

const formRef = ref<FormInstance>()
const rules: FormRules = {
  name: [{ required: true, message: '請輸入名稱' }]
}
```

#### 4. **主題定制**
```scss
// 支持 CSS 變量自定義主題
:root {
  --el-color-primary: #409eff;
  --el-color-success: #67c23a;
  --el-color-warning: #e6a23c;
  --el-color-danger: #f56c6c;
}
```

#### 5. **國際化支持**
```typescript
// 內建多語言支持
import ElementPlus from 'element-plus'
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'

app.use(ElementPlus, { locale: zhCn })
```

#### 6. **按需引入**
```typescript
// 支持 Tree-shaking，減小打包體積
import { ElButton, ElInput } from 'element-plus'
```

### Element Plus 的優勢

1. **成熟穩定**: 繼承自 Element UI，擁有多年的生態積累
2. **文檔完善**: 提供詳細的中文文檔和豐富的示例
3. **社區活躍**: 大量的開源項目和活躍的社區支持
4. **企業級應用**: 被眾多企業級項目採用，經過實戰檢驗
5. **持續更新**: 團隊持續維護和更新，跟進 Vue 3 最新特性

### 官方資源

- **官方網站**: https://element-plus.org/
- **GitHub**: https://github.com/element-plus/element-plus
- **中文文檔**: https://element-plus.org/zh-CN/
- **組件示例**: https://element-plus.org/zh-CN/component/

---

## 技術棧

### 核心技術

| 技術 | 版本 | 說明 |
|-----|------|------|
| Vue | ^3.4.21 | 漸進式 JavaScript 框架 |
| Element Plus | ^2.6.0 | Vue 3 組件庫 |
| TypeScript | ^5.4.2 | JavaScript 的超集，提供類型支持 |
| Vite | ^5.1.6 | 下一代前端構建工具 |

### 開發工具

- **vue-tsc**: Vue 3 TypeScript 編譯器
- **@vitejs/plugin-vue**: Vite 的 Vue 3 插件
- **@element-plus/icons-vue**: Element Plus 圖標庫

### 構建配置

```json
{
  "scripts": {
    "dev": "vite",                    // 啟動開發服務器
    "build": "vue-tsc && vite build", // 構建生產版本
    "preview": "vite preview",        // 預覽生產構建
    "type-check": "vue-tsc --noEmit"  // TypeScript 類型檢查
  }
}
```

---

## 核心功能

### 1. 待辦事項管理

#### 添加待辦事項
```typescript
const addTodo = (text: string): void => {
  const newTodo: Todo = {
    id: Date.now(),
    text: text.trim(),
    completed: false,
    createdAt: Date.now()
  }
  todos.value.unshift(newTodo)
  ElMessage.success('已成功添加待辦事項')
}
```

**功能特點**:
- ✅ 使用 `el-input` 組件提供友好的輸入體驗
- ✅ 支持 Enter 鍵快速添加
- ✅ 自動驗證輸入內容（長度限制 2-200 字符）
- ✅ 顯示字數統計
- ✅ 使用 `el-message` 提供操作反饋

#### 編輯待辦事項
```typescript
const editTodo = (id: number, newText: string): void => {
  const todo = todos.value.find(t => t.id === id)
  if (todo) {
    todo.text = newText.trim()
    ElMessage.success('已更新待辦事項')
  }
}
```

**功能特點**:
- ✅ 雙擊待辦事項進入編輯模式
- ✅ 使用 `el-input` 提供內聯編輯體驗
- ✅ 支持保存和取消操作
- ✅ 鍵盤快捷鍵支持（Enter 保存，Escape 取消）

#### 切換完成狀態
```typescript
const toggleTodo = (id: number): void => {
  const todo = todos.value.find(t => t.id === id)
  if (todo) {
    todo.completed = !todo.completed
    ElMessage.info(
      todo.completed ? '已標記為完成' : '已標記為未完成'
    )
  }
}
```

**功能特點**:
- ✅ 使用 `el-checkbox` 提供直觀的切換體驗
- ✅ 完成的項目自動添加刪除線樣式
- ✅ 實時更新統計數據
- ✅ 平滑的過渡動畫

#### 刪除待辦事項
```typescript
const deleteTodo = async (id: number): Promise<void> => {
  await ElMessageBox.confirm(
    '確定要刪除這個待辦事項嗎？',
    '刪除確認',
    {
      confirmButtonText: '確定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  )
  const index = todos.value.findIndex(t => t.id === id)
  if (index > -1) {
    todos.value.splice(index, 1)
    ElMessage.warning('已刪除待辦事項')
  }
}
```

**功能特點**:
- ✅ 使用 `el-message-box` 確認刪除操作
- ✅ 防止誤刪除
- ✅ 優雅的確認對話框

### 2. 過濾和篩選

```typescript
const filteredTodos = computed<Todo[]>(() => {
  switch (filter.value) {
    case 'active':
      return todos.value.filter(todo => !todo.completed)
    case 'completed':
      return todos.value.filter(todo => todo.completed)
    default:
      return todos.value
  }
})
```

**過濾選項**:
- **全部**: 顯示所有待辦事項
- **進行中**: 只顯示未完成的項目
- **已完成**: 只顯示已完成的項目

**UI 實現**:
```vue
<el-radio-group v-model="filter">
  <el-radio-button label="all">
    全部 ({{ stats.total }})
  </el-radio-button>
  <el-radio-button label="active">
    進行中 ({{ stats.active }})
  </el-radio-button>
  <el-radio-button label="completed">
    已完成 ({{ stats.completed }})
  </el-radio-button>
</el-radio-group>
```

### 3. 批量操作

#### 全部完成/取消
```typescript
const toggleAll = (): void => {
  const shouldComplete = !allCompleted.value
  todos.value.forEach(todo => {
    todo.completed = shouldComplete
  })
  ElMessage.info(
    shouldComplete ? '已全部標記為完成' : '已全部標記為未完成'
  )
}
```

#### 清除已完成
```typescript
const clearCompleted = (): void => {
  const completedCount = todos.value.filter(t => t.completed).length
  todos.value = todos.value.filter(t => !t.completed)

  if (completedCount > 0) {
    ElMessage.success(`已清除 ${completedCount} 個已完成的待辦事項`)
  }
}
```

### 4. 統計功能

```typescript
const stats = computed<TodoStats>(() => {
  const total = todos.value.length
  const completed = todos.value.filter(t => t.completed).length
  const active = total - completed
  const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0

  return { total, active, completed, completionRate }
})
```

**統計卡片顯示**:
```vue
<div class="stats-grid">
  <div class="stat-item">
    <div class="stat-label">總計</div>
    <div class="stat-value primary">{{ stats.total }}</div>
  </div>
  <div class="stat-item">
    <div class="stat-label">進行中</div>
    <div class="stat-value warning">{{ stats.active }}</div>
  </div>
  <div class="stat-item">
    <div class="stat-label">已完成</div>
    <div class="stat-value success">{{ stats.completed }}</div>
  </div>
  <div class="stat-item">
    <div class="stat-label">完成率</div>
    <div class="stat-value info">{{ stats.completionRate }}%</div>
  </div>
</div>

<!-- 進度條 -->
<el-progress
  :percentage="stats.completionRate"
  :color="stats.completionRate === 100 ? '#67c23a' : '#409eff'"
  :stroke-width="8"
/>
```

### 5. 主題切換

```typescript
const isDark = ref<boolean>(false)

const toggleTheme = (): void => {
  isDark.value = !isDark.value
  updateTheme()
  ElMessage.info(
    isDark.value ? '已切換至深色模式' : '已切換至淺色模式'
  )
}

const updateTheme = (): void => {
  const html = document.documentElement
  if (isDark.value) {
    html.classList.add('dark')
  } else {
    html.classList.remove('dark')
  }
}
```

**UI 實現**:
```vue
<div class="theme-switch">
  <el-icon :size="18"><Sunny /></el-icon>
  <el-switch
    v-model="isDark"
    @change="toggleTheme"
    inline-prompt
    :active-icon="Moon"
    :inactive-icon="Sunny"
  />
  <el-icon :size="18"><Moon /></el-icon>
</div>
```

### 6. 數據持久化

```typescript
// 保存到 LocalStorage
const saveTodos = (): void => {
  localStorage.setItem('vue-element-plus-todos', JSON.stringify(todos.value))
}

const saveTheme = (): void => {
  localStorage.setItem('vue-element-plus-theme', isDark.value ? 'dark' : 'light')
}

// 從 LocalStorage 載入
const loadTodos = (): void => {
  const saved = localStorage.getItem('vue-element-plus-todos')
  if (saved) {
    try {
      todos.value = JSON.parse(saved)
    } catch (error) {
      console.error('Failed to load todos:', error)
      todos.value = []
    }
  }
}

// 自動保存
watch(todos, saveTodos, { deep: true })
watch(isDark, saveTheme)
```

---

## 專案結構

```
06-vue-element-plus/
├── src/
│   ├── components/
│   │   ├── TodoInput.vue      # 待辦事項輸入組件
│   │   ├── TodoList.vue       # 待辦事項列表組件
│   │   └── TodoItem.vue       # 待辦事項項目組件
│   ├── App.vue                # 主應用組件
│   ├── main.ts                # 應用入口
│   └── types.ts               # TypeScript 類型定義
├── index.html                 # HTML 入口
├── vite.config.ts            # Vite 配置
├── tsconfig.json             # TypeScript 配置
├── tsconfig.node.json        # Node TypeScript 配置
├── package.json              # 項目依賴
└── README.md                 # 項目文檔
```

### 文件說明

#### `src/types.ts` - 類型定義
定義了整個應用使用的 TypeScript 類型:
- `Todo`: 待辦事項介面
- `FilterType`: 過濾器類型
- `TodoStats`: 統計資訊介面
- `ThemeType`: 主題類型
- `AppSettings`: 應用設定介面

#### `src/main.ts` - 應用入口
負責:
- 創建 Vue 應用實例
- 註冊 Element Plus 組件庫
- 註冊 Element Plus 圖標
- 掛載應用到 DOM

#### `src/App.vue` - 主組件
應用的根組件，包含:
- 狀態管理邏輯
- 待辦事項 CRUD 操作
- 過濾和統計邏輯
- 主題切換功能
- LocalStorage 持久化

#### `src/components/TodoInput.vue` - 輸入組件
提供待辦事項輸入功能:
- `el-input` 輸入框
- 輸入驗證
- Enter 鍵快捷添加
- 字數統計

#### `src/components/TodoList.vue` - 列表組件
顯示待辦事項列表:
- 渲染 TodoItem 組件
- 空狀態處理（`el-empty`）
- 列表頭部和統計

#### `src/components/TodoItem.vue` - 項目組件
單個待辦事項的顯示和操作:
- 複選框（`el-checkbox`）
- 編輯模式
- 刪除確認
- 時間戳顯示

---

## 快速開始

### 環境要求

- **Node.js**: >= 16.0.0
- **npm**: >= 7.0.0 或 **yarn**: >= 1.22.0 或 **pnpm**: >= 6.0.0

### 安裝步驟

#### 1. 安裝依賴

使用 npm:
```bash
npm install
```

使用 yarn:
```bash
yarn install
```

使用 pnpm:
```bash
pnpm install
```

#### 2. 啟動開發服務器

```bash
npm run dev
```

應用將在 `http://localhost:5173` 運行。

#### 3. 構建生產版本

```bash
npm run build
```

構建產物將輸出到 `dist/` 目錄。

#### 4. 預覽生產構建

```bash
npm run preview
```

#### 5. TypeScript 類型檢查

```bash
npm run type-check
```

### 開發工作流

```bash
# 1. 克隆或下載專案
git clone <repository-url>
cd 06-vue-element-plus

# 2. 安裝依賴
npm install

# 3. 啟動開發服務器
npm run dev

# 4. 開始開發
# - 修改代碼會自動熱更新
# - 檢查瀏覽器控制台的錯誤和警告

# 5. 構建前檢查
npm run type-check

# 6. 構建生產版本
npm run build

# 7. 測試生產構建
npm run preview
```

---

## 組件詳解

### App.vue - 主應用組件

#### 組件結構

```vue
<script setup lang="ts">
// 導入依賴
import { ref, computed, watch, onMounted } from 'vue'
import { ElMessage } from 'element-plus'

// 狀態定義
const todos = ref<Todo[]>([])
const filter = ref<FilterType>('all')
const isDark = ref<boolean>(false)

// 計算屬性
const filteredTodos = computed(() => { /* ... */ })
const stats = computed(() => { /* ... */ })

// 方法
const addTodo = (text: string) => { /* ... */ }
const toggleTodo = (id: number) => { /* ... */ }
const deleteTodo = (id: number) => { /* ... */ }

// 生命週期
onMounted(() => {
  loadTodos()
  loadTheme()
})
</script>

<template>
  <el-container class="app-container">
    <el-header class="app-header">
      <!-- 頭部內容 -->
    </el-header>

    <el-main class="app-main">
      <!-- 主要內容 -->
    </el-main>
  </el-container>
</template>
```

#### 核心功能實現

**1. 狀態管理**
```typescript
// 響應式狀態
const todos = ref<Todo[]>([])        // 待辦事項列表
const filter = ref<FilterType>('all') // 當前過濾器
const isDark = ref<boolean>(false)    // 深色模式狀態
```

**2. 計算屬性**
```typescript
// 過濾後的待辦事項
const filteredTodos = computed<Todo[]>(() => {
  switch (filter.value) {
    case 'active':
      return todos.value.filter(todo => !todo.completed)
    case 'completed':
      return todos.value.filter(todo => todo.completed)
    default:
      return todos.value
  }
})

// 統計數據
const stats = computed<TodoStats>(() => {
  const total = todos.value.length
  const completed = todos.value.filter(t => t.completed).length
  const active = total - completed
  const completionRate = total > 0
    ? Math.round((completed / total) * 100)
    : 0

  return { total, active, completed, completionRate }
})
```

**3. CRUD 操作**
```typescript
// 添加
const addTodo = (text: string): void => {
  const newTodo: Todo = {
    id: Date.now(),
    text: text.trim(),
    completed: false,
    createdAt: Date.now()
  }
  todos.value.unshift(newTodo)
  ElMessage.success('已成功添加待辦事項')
}

// 更新
const editTodo = (id: number, newText: string): void => {
  const todo = todos.value.find(t => t.id === id)
  if (todo) {
    todo.text = newText.trim()
    ElMessage.success('已更新待辦事項')
  }
}

// 刪除
const deleteTodo = (id: number): void => {
  const index = todos.value.findIndex(t => t.id === id)
  if (index > -1) {
    todos.value.splice(index, 1)
    ElMessage.warning('已刪除待辦事項')
  }
}

// 切換完成狀態
const toggleTodo = (id: number): void => {
  const todo = todos.value.find(t => t.id === id)
  if (todo) {
    todo.completed = !todo.completed
  }
}
```

### TodoInput.vue - 輸入組件

#### 組件功能

這個組件負責處理新待辦事項的輸入和驗證。

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage } from 'element-plus'

const emit = defineEmits<{
  addTodo: [text: string]
}>()

const inputValue = ref<string>('')

const handleAdd = (): void => {
  const text = inputValue.value.trim()

  // 驗證邏輯
  if (!text) {
    ElMessage.warning('請輸入待辦事項內容')
    return
  }

  if (text.length < 2) {
    ElMessage.warning('待辦事項內容至少需要 2 個字符')
    return
  }

  if (text.length > 200) {
    ElMessage.warning('待辦事項內容不能超過 200 個字符')
    return
  }

  emit('addTodo', text)
  inputValue.value = ''
}
</script>

<template>
  <div class="todo-input">
    <el-input
      v-model="inputValue"
      placeholder="請輸入新的待辦事項..."
      size="large"
      clearable
      maxlength="200"
      show-word-limit
      @keypress.enter="handleAdd"
    >
      <template #prefix>
        <el-icon><Edit /></el-icon>
      </template>
    </el-input>

    <el-button
      type="primary"
      size="large"
      @click="handleAdd"
      :icon="Plus"
    >
      添加
    </el-button>
  </div>
</template>
```

#### Element Plus 組件使用

**el-input 輸入框**:
- `v-model`: 雙向綁定
- `size="large"`: 大尺寸
- `clearable`: 顯示清除按鈕
- `maxlength="200"`: 最大長度限制
- `show-word-limit`: 顯示字數統計
- `@keypress.enter`: Enter 鍵事件

**el-button 按鈕**:
- `type="primary"`: 主要按鈕樣式
- `size="large"`: 大尺寸
- `:icon="Plus"`: 圖標

### TodoList.vue - 列表組件

#### 組件功能

顯示待辦事項列表或空狀態。

```vue
<script setup lang="ts">
import { computed } from 'vue'
import TodoItem from './TodoItem.vue'
import type { Todo, FilterType } from '../types'

const props = defineProps<{
  todos: Todo[]
  filter: FilterType
}>()

const emit = defineEmits<{
  toggleTodo: [id: number]
  deleteTodo: [id: number]
  editTodo: [id: number, text: string]
}>()

const emptyDescription = computed<string>(() => {
  switch (props.filter) {
    case 'active':
      return '目前沒有進行中的待辦事項'
    case 'completed':
      return '目前沒有已完成的待辦事項'
    default:
      return '還沒有任何待辦事項，開始添加一個吧！'
  }
})
</script>

<template>
  <!-- 有數據時顯示列表 -->
  <el-card v-if="todos.length > 0" class="list-card">
    <div class="list-header">
      <h3 class="list-title">
        <el-icon><List /></el-icon>
        待辦事項列表
      </h3>
      <el-tag type="info" size="large">
        共 {{ todos.length }} 項
      </el-tag>
    </div>

    <div class="todo-items">
      <TodoItem
        v-for="todo in todos"
        :key="todo.id"
        :todo="todo"
        @toggle="emit('toggleTodo', todo.id)"
        @delete="emit('deleteTodo', todo.id)"
        @edit="(text) => emit('editTodo', todo.id, text)"
      />
    </div>
  </el-card>

  <!-- 無數據時顯示空狀態 -->
  <el-card v-else class="empty-card">
    <el-empty :description="emptyDescription">
      <template #image>
        <el-icon :size="80" class="empty-icon">
          <Document />
        </el-icon>
      </template>
    </el-empty>
  </el-card>
</template>
```

#### Element Plus 組件使用

**el-card 卡片**:
- `shadow="hover"`: 懸停時顯示陰影
- `class="list-card"`: 自定義樣式類

**el-empty 空狀態**:
- `:description`: 動態描述文字
- `#image` 插槽: 自定義圖標

**el-tag 標籤**:
- `type="info"`: 信息類型
- `size="large"`: 大尺寸

### TodoItem.vue - 項目組件

#### 組件功能

顯示單個待辦事項，支持編輯、切換完成狀態和刪除。

```vue
<script setup lang="ts">
import { ref, computed } from 'vue'
import { ElMessageBox } from 'element-plus'
import type { Todo } from '../types'

const props = defineProps<{
  todo: Todo
}>()

const emit = defineEmits<{
  toggle: []
  delete: []
  edit: [text: string]
}>()

const isEditing = ref<boolean>(false)
const editText = ref<string>('')

// 格式化時間
const formattedDate = computed<string>(() => {
  const date = new Date(props.todo.createdAt)
  return date.toLocaleString('zh-TW', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
})

// 編輯操作
const startEdit = (): void => {
  isEditing.value = true
  editText.value = props.todo.text
}

const saveEdit = (): void => {
  const text = editText.value.trim()
  if (text && text !== props.todo.text) {
    emit('edit', text)
  }
  isEditing.value = false
}

const cancelEdit = (): void => {
  isEditing.value = false
  editText.value = ''
}

// 刪除操作
const handleDelete = async (): Promise<void> => {
  try {
    await ElMessageBox.confirm(
      '確定要刪除這個待辦事項嗎？',
      '刪除確認',
      {
        confirmButtonText: '確定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )
    emit('delete')
  } catch {
    // 用戶取消
  }
}
</script>

<template>
  <div class="todo-item" :class="{ completed: todo.completed }">
    <div class="todo-content">
      <!-- 複選框 -->
      <el-checkbox
        :model-value="todo.completed"
        @change="emit('toggle')"
        size="large"
      />

      <!-- 文字或編輯輸入框 -->
      <div class="todo-text-wrapper">
        <el-input
          v-if="isEditing"
          v-model="editText"
          size="large"
          autofocus
          @keyup.enter="saveEdit"
          @keyup.escape="cancelEdit"
        />
        <div v-else class="todo-text" @dblclick="startEdit">
          {{ todo.text }}
        </div>

        <!-- 時間戳 -->
        <div class="todo-meta">
          <el-icon><Calendar /></el-icon>
          <span>{{ formattedDate }}</span>
        </div>
      </div>

      <!-- 狀態標籤 -->
      <el-tag
        :type="todo.completed ? 'success' : 'info'"
        effect="dark"
        size="small"
      >
        {{ todo.completed ? '已完成' : '進行中' }}
      </el-tag>
    </div>

    <!-- 操作按鈕 -->
    <div class="todo-actions">
      <template v-if="isEditing">
        <el-button type="success" :icon="Check" circle @click="saveEdit" />
        <el-button type="info" :icon="Close" circle @click="cancelEdit" />
      </template>
      <template v-else>
        <el-button type="primary" :icon="Edit" circle @click="startEdit" />
        <el-button type="danger" :icon="Delete" circle @click="handleDelete" />
      </template>
    </div>
  </div>
</template>
```

#### Element Plus 組件使用

**el-checkbox 複選框**:
- `:model-value`: 綁定完成狀態
- `@change`: 切換事件
- `size="large"`: 大尺寸

**el-button 按鈕**:
- `circle`: 圓形按鈕
- `:icon`: 動態圖標
- `type`: 按鈕類型（success, info, primary, danger）

**el-message-box 確認框**:
- `ElMessageBox.confirm()`: 確認對話框
- `type: 'warning'`: 警告類型
- Promise 模式處理用戶選擇

---

## Element Plus 組件使用

### 1. Container 布局容器

```vue
<el-container class="app-container">
  <el-header class="app-header">
    <!-- 頭部內容 -->
  </el-header>

  <el-main class="app-main">
    <!-- 主要內容 -->
  </el-main>
</el-container>
```

**特點**:
- `el-container`: 外層容器
- `el-header`: 頂部欄容器
- `el-main`: 主要區域容器
- 自動垂直布局

### 2. Input 輸入框

```vue
<el-input
  v-model="inputValue"
  placeholder="請輸入..."
  size="large"
  clearable
  maxlength="200"
  show-word-limit
  @keypress.enter="handleSubmit"
>
  <template #prefix>
    <el-icon><Edit /></el-icon>
  </template>
</el-input>
```

**屬性**:
- `v-model`: 雙向綁定
- `size`: 尺寸（large/default/small）
- `clearable`: 顯示清除按鈕
- `maxlength`: 最大長度
- `show-word-limit`: 顯示字數統計
- `#prefix` 插槽: 前綴內容

### 3. Button 按鈕

```vue
<!-- 基礎按鈕 -->
<el-button type="primary" size="large" @click="handleClick">
  按鈕文字
</el-button>

<!-- 帶圖標的按鈕 -->
<el-button type="success" :icon="Plus" @click="handleAdd">
  添加
</el-button>

<!-- 圓形圖標按鈕 -->
<el-button type="primary" :icon="Edit" circle />
```

**類型**:
- `primary`: 主要按鈕
- `success`: 成功按鈕
- `warning`: 警告按鈕
- `danger`: 危險按鈕
- `info`: 信息按鈕

### 4. Checkbox 複選框

```vue
<el-checkbox
  :model-value="checked"
  @change="handleChange"
  size="large"
>
  選項文字
</el-checkbox>
```

**用法**:
- `:model-value`: 綁定值
- `@change`: 變更事件
- `size`: 尺寸

### 5. Switch 開關

```vue
<el-switch
  v-model="isDark"
  @change="toggleTheme"
  inline-prompt
  :active-icon="Moon"
  :inactive-icon="Sunny"
/>
```

**屬性**:
- `v-model`: 雙向綁定
- `inline-prompt`: 顯示內聯文字
- `:active-icon`: 開啟狀態圖標
- `:inactive-icon`: 關閉狀態圖標

### 6. Card 卡片

```vue
<el-card class="stats-card" shadow="hover">
  <!-- 卡片內容 -->
</el-card>
```

**屬性**:
- `shadow`: 陰影效果（always/hover/never）
- 支持 header 插槽

### 7. Tag 標籤

```vue
<el-tag type="primary" effect="dark">
  Vue 3
</el-tag>

<el-tag type="success" size="large">
  Element Plus
</el-tag>
```

**類型**:
- `primary`, `success`, `warning`, `danger`, `info`

**效果**:
- `dark`: 深色效果
- `light`: 淺色效果
- `plain`: 樸素效果

### 8. Progress 進度條

```vue
<el-progress
  :percentage="completionRate"
  :color="completionRate === 100 ? '#67c23a' : '#409eff'"
  :stroke-width="8"
/>
```

**屬性**:
- `:percentage`: 百分比值
- `:color`: 進度條顏色
- `:stroke-width`: 進度條寬度

### 9. Radio 單選框組

```vue
<el-radio-group v-model="filter">
  <el-radio-button label="all">全部</el-radio-button>
  <el-radio-button label="active">進行中</el-radio-button>
  <el-radio-button label="completed">已完成</el-radio-button>
</el-radio-group>
```

**特點**:
- `el-radio-group`: 單選組容器
- `el-radio-button`: 按鈕樣式的單選項
- `v-model`: 綁定選中值

### 10. Message 消息提示

```typescript
import { ElMessage } from 'element-plus'

// 成功消息
ElMessage.success('操作成功！')

// 警告消息
ElMessage.warning('請注意！')

// 錯誤消息
ElMessage.error('操作失敗！')

// 信息消息
ElMessage.info('這是一條信息')

// 自定義配置
ElMessage({
  message: '已成功添加待辦事項',
  type: 'success',
  duration: 2000
})
```

### 11. MessageBox 確認框

```typescript
import { ElMessageBox } from 'element-plus'

// 確認對話框
await ElMessageBox.confirm(
  '確定要刪除這個待辦事項嗎？',
  '刪除確認',
  {
    confirmButtonText: '確定',
    cancelButtonText: '取消',
    type: 'warning'
  }
)
```

### 12. Empty 空狀態

```vue
<el-empty description="還沒有任何待辦事項">
  <template #image>
    <el-icon :size="80">
      <Document />
    </el-icon>
  </template>
</el-empty>
```

**插槽**:
- `#image`: 自定義圖片
- `#description`: 自定義描述

### 13. Icon 圖標

```vue
<!-- 基礎用法 -->
<el-icon><Edit /></el-icon>

<!-- 設置大小 -->
<el-icon :size="20"><Delete /></el-icon>

<!-- 設置顏色 -->
<el-icon color="#409eff"><Check /></el-icon>
```

**常用圖標**:
- `Document`, `Edit`, `Delete`, `Check`, `Close`
- `Plus`, `Minus`, `Calendar`, `List`
- `Sunny`, `Moon`, `Cpu`, `Trophy`

---

## Element Plus vs Vuetify

### 框架對比

| 特性 | Element Plus | Vuetify |
|-----|-------------|---------|
| **框架支持** | Vue 3 | Vue 2/3 |
| **設計風格** | 簡潔、商務風格 | Material Design |
| **組件數量** | 60+ | 80+ |
| **TypeScript** | 完整支持 | 完整支持 |
| **文件大小** | 較小 (~200KB) | 較大 (~400KB) |
| **學習曲線** | 較平緩 | 稍陡峭 |
| **中文文檔** | 完善 | 完善 |
| **社區活躍度** | 很高 | 很高 |
| **企業採用** | 阿里巴巴等 | 國際企業 |

### 設計理念

#### Element Plus
- **簡潔實用**: 專注於桌面端應用
- **商務風格**: 適合後台管理系統
- **輕量級**: 打包體積較小
- **快速開發**: 組件 API 簡單直觀

#### Vuetify
- **Material Design**: 遵循 Google 設計規範
- **移動優先**: 響應式設計更完善
- **視覺豐富**: 動畫和過渡效果更多
- **主題系統**: 更強大的主題定制

### 組件對比

#### 按鈕組件

**Element Plus**:
```vue
<el-button type="primary" size="large">
  按鈕
</el-button>
```

**Vuetify**:
```vue
<v-btn color="primary" size="large">
  按鈕
</v-btn>
```

#### 輸入框組件

**Element Plus**:
```vue
<el-input
  v-model="value"
  placeholder="請輸入"
  clearable
/>
```

**Vuetify**:
```vue
<v-text-field
  v-model="value"
  label="請輸入"
  clearable
/>
```

#### 卡片組件

**Element Plus**:
```vue
<el-card shadow="hover">
  <template #header>
    <span>卡片標題</span>
  </template>
  卡片內容
</el-card>
```

**Vuetify**:
```vue
<v-card>
  <v-card-title>卡片標題</v-card-title>
  <v-card-text>卡片內容</v-card-text>
</v-card>
```

### 使用場景建議

#### 選擇 Element Plus 的場景
- ✅ 桌面端後台管理系統
- ✅ 中後台企業應用
- ✅ 需要快速開發
- ✅ 追求輕量級
- ✅ 中文用戶為主
- ✅ 商務風格設計

#### 選擇 Vuetify 的場景
- ✅ Material Design 風格項目
- ✅ 移動端優先應用
- ✅ 需要豐富的動畫效果
- ✅ 國際化項目
- ✅ 需要複雜的主題定制
- ✅ 視覺設計要求高

### 性能對比

#### 打包體積

**Element Plus**:
```
完整引入: ~200KB (gzipped)
按需引入: ~50KB+ (根據使用的組件)
```

**Vuetify**:
```
完整引入: ~400KB (gzipped)
按需引入: ~100KB+ (根據使用的組件)
```

#### 運行時性能

兩者在運行時性能上差異不大，主要取決於:
- 使用的組件數量
- 應用的複雜度
- 是否按需引入

### 生態系統

#### Element Plus
- **官方工具**: Element Plus Icons
- **UI 生成器**: Element Plus Template
- **主題編輯器**: Theme Roller
- **社區插件**: 豐富的第三方插件

#### Vuetify
- **官方工具**: Vuetify CLI
- **UI 生成器**: Vuetify UI Kit
- **主題編輯器**: Theme Generator
- **社區資源**: 大量模板和主題

### 遷移建議

如果你正在考慮從一個框架遷移到另一個:

#### 從 Vuetify 到 Element Plus
1. 組件 API 較相似，遷移成本適中
2. 需要調整設計風格
3. 打包體積會減小
4. 適合桌面端項目

#### 從 Element Plus 到 Vuetify
1. 需要適應 Material Design 風格
2. 需要學習更複雜的主題系統
3. 可以獲得更豐富的移動端支持
4. 適合追求視覺效果的項目

---

## TypeScript 類型系統

### 類型定義文件 (types.ts)

```typescript
/**
 * Todo 項目介面定義
 */
export interface Todo {
  /** 唯一識別碼 */
  id: number
  /** 待辦事項文字內容 */
  text: string
  /** 完成狀態 */
  completed: boolean
  /** 創建時間戳記 */
  createdAt: number
}

/**
 * 過濾器類型
 */
export type FilterType = 'all' | 'active' | 'completed'

/**
 * 統計資訊介面
 */
export interface TodoStats {
  /** 總數量 */
  total: number
  /** 活躍數量 */
  active: number
  /** 完成數量 */
  completed: number
  /** 完成百分比 */
  completionRate: number
}

/**
 * 主題類型
 */
export type ThemeType = 'light' | 'dark'

/**
 * 應用設定介面
 */
export interface AppSettings {
  /** 主題模式 */
  theme: ThemeType
  /** 語言設定 */
  locale?: string
}
```

### 組件 Props 類型

#### 使用 defineProps 定義類型

```typescript
// TodoList.vue
const props = defineProps<{
  todos: Todo[]
  filter: FilterType
}>()
```

#### 使用 withDefaults 提供默認值

```typescript
interface Props {
  todos: Todo[]
  filter?: FilterType
  showStats?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  filter: 'all',
  showStats: true
})
```

### 事件類型定義

```typescript
// 定義事件類型
const emit = defineEmits<{
  addTodo: [text: string]
  toggleTodo: [id: number]
  deleteTodo: [id: number]
  editTodo: [id: number, text: string]
}>()

// 使用
emit('addTodo', 'New todo')
emit('editTodo', 1, 'Updated text')
```

### Ref 類型註解

```typescript
// 基礎類型
const count = ref<number>(0)
const name = ref<string>('')
const isActive = ref<boolean>(false)

// 陣列類型
const todos = ref<Todo[]>([])

// 聯合類型
const filter = ref<FilterType>('all')

// 可選類型
const user = ref<User | null>(null)

// 元素引用
const inputRef = ref<HTMLInputElement | null>(null)

// Element Plus 組件引用
import type { FormInstance } from 'element-plus'
const formRef = ref<FormInstance>()
```

### Computed 類型推斷

```typescript
// 自動類型推斷
const doubled = computed(() => count.value * 2) // number

// 明確類型註解
const filteredTodos = computed<Todo[]>(() => {
  return todos.value.filter(t => !t.completed)
})

// 複雜類型
const stats = computed<TodoStats>(() => {
  return {
    total: todos.value.length,
    active: todos.value.filter(t => !t.completed).length,
    completed: todos.value.filter(t => t.completed).length,
    completionRate: 0
  }
})
```

### 函數類型註解

```typescript
// 基礎函數
const addTodo = (text: string): void => {
  // ...
}

// 帶返回值
const getTodoById = (id: number): Todo | undefined => {
  return todos.value.find(t => t.id === id)
}

// 異步函數
const fetchTodos = async (): Promise<Todo[]> => {
  const response = await fetch('/api/todos')
  return response.json()
}

// 事件處理器
const handleKeyPress = (event: KeyboardEvent): void => {
  if (event.key === 'Enter') {
    handleSubmit()
  }
}
```

### Element Plus 組件類型

```typescript
// Message 組件類型
import { ElMessage } from 'element-plus'
import type { MessageOptions } from 'element-plus'

const showMessage = (options: MessageOptions): void => {
  ElMessage(options)
}

// Form 實例類型
import type { FormInstance, FormRules } from 'element-plus'

const formRef = ref<FormInstance>()
const rules: FormRules = {
  name: [
    { required: true, message: '請輸入名稱', trigger: 'blur' }
  ]
}

// Table 列定義類型
import type { TableColumnCtx } from 'element-plus'

interface User {
  id: number
  name: string
}

const formatter = (
  row: User,
  column: TableColumnCtx<User>,
  cellValue: any
) => {
  return cellValue
}
```

### 類型守衛

```typescript
// 類型守衛函數
function isTodo(item: any): item is Todo {
  return (
    typeof item === 'object' &&
    'id' in item &&
    'text' in item &&
    'completed' in item &&
    'createdAt' in item
  )
}

// 使用類型守衛
const loadTodos = (): void => {
  const saved = localStorage.getItem('todos')
  if (saved) {
    try {
      const parsed = JSON.parse(saved)
      if (Array.isArray(parsed) && parsed.every(isTodo)) {
        todos.value = parsed
      }
    } catch (error) {
      console.error('Failed to load todos:', error)
    }
  }
}
```

### 泛型使用

```typescript
// 泛型函數
function findById<T extends { id: number }>(
  items: T[],
  id: number
): T | undefined {
  return items.find(item => item.id === id)
}

// 使用
const todo = findById(todos.value, 1)

// 泛型組件 Props
interface ListProps<T> {
  items: T[]
  keyField: keyof T
  render: (item: T) => string
}

// 泛型 Hook
function useLocalStorage<T>(
  key: string,
  initialValue: T
): [Ref<T>, (value: T) => void] {
  const storedValue = ref<T>(initialValue)

  const setValue = (value: T): void => {
    storedValue.value = value
    localStorage.setItem(key, JSON.stringify(value))
  }

  return [storedValue, setValue]
}
```

---

## 狀態管理

### 響應式狀態

```typescript
// 基礎狀態
const todos = ref<Todo[]>([])
const filter = ref<FilterType>('all')
const isDark = ref<boolean>(false)

// 複雜狀態
const appSettings = ref<AppSettings>({
  theme: 'light',
  locale: 'zh-TW'
})
```

### 計算屬性

```typescript
// 過濾後的待辦事項
const filteredTodos = computed<Todo[]>(() => {
  switch (filter.value) {
    case 'active':
      return todos.value.filter(todo => !todo.completed)
    case 'completed':
      return todos.value.filter(todo => todo.completed)
    default:
      return todos.value
  }
})

// 統計數據
const stats = computed<TodoStats>(() => {
  const total = todos.value.length
  const completed = todos.value.filter(t => t.completed).length
  const active = total - completed
  const completionRate = total > 0
    ? Math.round((completed / total) * 100)
    : 0

  return { total, active, completed, completionRate }
})

// 檢查狀態
const hasTodos = computed<boolean>(() => todos.value.length > 0)
const allCompleted = computed<boolean>(() => {
  return hasTodos.value && todos.value.every(todo => todo.completed)
})
```

### 狀態更新

```typescript
// 添加
const addTodo = (text: string): void => {
  const newTodo: Todo = {
    id: Date.now(),
    text: text.trim(),
    completed: false,
    createdAt: Date.now()
  }
  todos.value.unshift(newTodo)
}

// 更新
const updateTodo = (id: number, updates: Partial<Todo>): void => {
  const index = todos.value.findIndex(t => t.id === id)
  if (index > -1) {
    todos.value[index] = { ...todos.value[index], ...updates }
  }
}

// 刪除
const deleteTodo = (id: number): void => {
  const index = todos.value.findIndex(t => t.id === id)
  if (index > -1) {
    todos.value.splice(index, 1)
  }
}

// 批量操作
const toggleAll = (): void => {
  const shouldComplete = !allCompleted.value
  todos.value.forEach(todo => {
    todo.completed = shouldComplete
  })
}

const clearCompleted = (): void => {
  todos.value = todos.value.filter(t => !t.completed)
}
```

### 監聽器

```typescript
// 深度監聽
watch(todos, (newTodos, oldTodos) => {
  console.log('Todos changed:', newTodos)
  saveTodos()
}, { deep: true })

// 單一屬性監聽
watch(filter, (newFilter) => {
  console.log('Filter changed:', newFilter)
})

// 多個數據源
watch([todos, filter], ([newTodos, newFilter]) => {
  console.log('Todos or filter changed')
})

// immediate 選項
watch(isDark, (newValue) => {
  updateTheme()
}, { immediate: true })
```

### Composables (可組合函數)

```typescript
// useTodos.ts
export function useTodos() {
  const todos = ref<Todo[]>([])

  const addTodo = (text: string) => {
    todos.value.push({
      id: Date.now(),
      text,
      completed: false,
      createdAt: Date.now()
    })
  }

  const deleteTodo = (id: number) => {
    const index = todos.value.findIndex(t => t.id === id)
    if (index > -1) {
      todos.value.splice(index, 1)
    }
  }

  return {
    todos,
    addTodo,
    deleteTodo
  }
}

// 使用
const { todos, addTodo, deleteTodo } = useTodos()
```

---

## 本地存儲

### LocalStorage 實現

```typescript
// 存儲鍵名常量
const STORAGE_KEY = 'vue-element-plus-todos'
const THEME_KEY = 'vue-element-plus-theme'

// 保存待辦事項
const saveTodos = (): void => {
  try {
    const data = JSON.stringify(todos.value)
    localStorage.setItem(STORAGE_KEY, data)
  } catch (error) {
    console.error('Failed to save todos:', error)
    ElMessage.error('保存失敗')
  }
}

// 載入待辦事項
const loadTodos = (): void => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      todos.value = JSON.parse(saved)
    }
  } catch (error) {
    console.error('Failed to load todos:', error)
    todos.value = []
  }
}

// 保存主題
const saveTheme = (): void => {
  localStorage.setItem(THEME_KEY, isDark.value ? 'dark' : 'light')
}

// 載入主題
const loadTheme = (): void => {
  const saved = localStorage.getItem(THEME_KEY)
  isDark.value = saved === 'dark'
  updateTheme()
}
```

### 自動保存

```typescript
// 監聽變化並自動保存
watch(todos, saveTodos, { deep: true })
watch(isDark, saveTheme)

// 應用初始化時載入
onMounted(() => {
  loadTodos()
  loadTheme()
})
```

### 完整的存儲工具

```typescript
// useLocalStorage.ts
export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [Ref<T>, () => void, () => void] {
  const storedValue = ref<T>(initialValue)

  // 載入數據
  const load = (): void => {
    try {
      const item = localStorage.getItem(key)
      if (item) {
        storedValue.value = JSON.parse(item)
      }
    } catch (error) {
      console.error(`Failed to load ${key}:`, error)
      storedValue.value = initialValue
    }
  }

  // 保存數據
  const save = (): void => {
    try {
      localStorage.setItem(key, JSON.stringify(storedValue.value))
    } catch (error) {
      console.error(`Failed to save ${key}:`, error)
    }
  }

  // 初始化時載入
  load()

  // 自動保存
  watch(storedValue, save, { deep: true })

  return [storedValue, load, save]
}

// 使用
const [todos] = useLocalStorage<Todo[]>('todos', [])
```

---

## 主題系統

### 深色模式實現

```typescript
// 主題狀態
const isDark = ref<boolean>(false)

// 切換主題
const toggleTheme = (): void => {
  isDark.value = !isDark.value
  updateTheme()
  ElMessage.info(
    isDark.value ? '已切換至深色模式' : '已切換至淺色模式'
  )
}

// 更新 DOM
const updateTheme = (): void => {
  const html = document.documentElement
  if (isDark.value) {
    html.classList.add('dark')
  } else {
    html.classList.remove('dark')
  }
}

// 初始化主題
onMounted(() => {
  loadTheme()
})
```

### Element Plus 深色模式

Element Plus 內建深色模式支持，通過 CSS 類名 `dark` 控制：

```typescript
// main.ts
import 'element-plus/theme-chalk/dark/css-vars.css'
```

```css
/* 深色模式樣式 */
.dark {
  /* Element Plus 會自動應用深色主題變量 */
}
```

### 自定義主題變量

```css
/* 淺色模式 */
:root {
  --el-color-primary: #409eff;
  --el-color-success: #67c23a;
  --el-color-warning: #e6a23c;
  --el-color-danger: #f56c6c;
  --el-color-info: #909399;
}

/* 深色模式 */
.dark {
  --el-bg-color: #1e1e1e;
  --el-text-color-primary: #e0e0e0;
  --el-border-color: #333;
}
```

### 組件級主題定制

```vue
<style scoped>
.app-container {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.dark .app-container {
  background: linear-gradient(135deg, #2c3e50 0%, #34495e 100%);
}

.todo-item {
  background: rgba(0, 0, 0, 0.02);
}

.dark .todo-item {
  background: rgba(255, 255, 255, 0.05);
}
</style>
```

---

## 響應式設計

### 斷點定義

```css
/* 移動設備 */
@media (max-width: 480px) {
  /* 手機樣式 */
}

/* 平板設備 */
@media (max-width: 768px) {
  /* 平板樣式 */
}

/* 桌面設備 */
@media (min-width: 769px) {
  /* 桌面樣式 */
}
```

### 響應式布局

```css
/* 頭部響應式 */
@media (max-width: 768px) {
  .header-content {
    flex-direction: column;
    align-items: flex-start;
  }

  .app-title {
    font-size: 24px;
  }
}

/* 統計網格響應式 */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 20px;
}

@media (max-width: 768px) {
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 480px) {
  .stats-grid {
    grid-template-columns: 1fr;
  }
}
```

### 響應式組件

```css
/* 過濾器和按鈕響應式 */
.filter-actions {
  display: flex;
  justify-content: space-between;
  gap: 16px;
}

@media (max-width: 768px) {
  .filter-actions {
    flex-direction: column;
    align-items: stretch;
  }

  .action-buttons {
    flex-direction: column;
  }

  .action-buttons .el-button {
    width: 100%;
  }
}
```

---

## 性能優化

### 1. 按需引入組件

```typescript
// 完整引入 (不推薦)
import ElementPlus from 'element-plus'
app.use(ElementPlus)

// 按需引入 (推薦)
import { ElButton, ElInput } from 'element-plus'
app.component(ElButton.name, ElButton)
app.component(ElInput.name, ElInput)
```

### 2. v-if vs v-show

```vue
<!-- 頻繁切換使用 v-show -->
<div v-show="isVisible">
  <!-- 內容 -->
</div>

<!-- 條件渲染使用 v-if -->
<div v-if="hasTodos">
  <!-- 內容 -->
</div>
```

### 3. 列表渲染優化

```vue
<!-- 使用 key -->
<TodoItem
  v-for="todo in todos"
  :key="todo.id"
  :todo="todo"
/>

<!-- 避免在 v-for 中使用 v-if -->
<!-- 不好 -->
<div v-for="todo in todos" v-if="!todo.completed">
  {{ todo.text }}
</div>

<!-- 好 -->
<div v-for="todo in activeTodos">
  {{ todo.text }}
</div>
```

### 4. 計算屬性緩存

```typescript
// 使用計算屬性而不是方法
const filteredTodos = computed(() => {
  return todos.value.filter(t => !t.completed)
})

// 而不是
const getFilteredTodos = () => {
  return todos.value.filter(t => !t.completed)
}
```

### 5. 事件處理優化

```vue
<!-- 使用事件修飾符 -->
<form @submit.prevent="handleSubmit">
  <!-- ... -->
</form>

<!-- 按鍵修飾符 -->
<input @keyup.enter="handleEnter" />
```

### 6. 組件懶加載

```typescript
// 路由懶加載
const TodoList = () => import('./components/TodoList.vue')

// 條件懶加載
const HeavyComponent = defineAsyncComponent(() =>
  import('./components/HeavyComponent.vue')
)
```

---

## 最佳實踐

### 1. 組件設計

**單一職責原則**:
```typescript
// ✅ 好：每個組件只負責一個功能
TodoInput.vue   // 只負責輸入
TodoList.vue    // 只負責列表顯示
TodoItem.vue    // 只負責單個項目

// ❌ 不好：一個組件做太多事情
TodoApp.vue     // 包含所有邏輯和 UI
```

**Props 向下，Events 向上**:
```vue
<!-- 父組件 -->
<TodoList
  :todos="todos"
  @toggle="handleToggle"
  @delete="handleDelete"
/>

<!-- 子組件 -->
<script setup>
const props = defineProps<{ todos: Todo[] }>()
const emit = defineEmits<{
  toggle: [id: number]
  delete: [id: number]
}>()
</script>
```

### 2. TypeScript 使用

**明確的類型定義**:
```typescript
// ✅ 好
interface Todo {
  id: number
  text: string
  completed: boolean
  createdAt: number
}

// ❌ 不好
interface Todo {
  id: any
  text: any
  completed: any
}
```

**避免使用 any**:
```typescript
// ✅ 好
const handleEvent = (event: KeyboardEvent): void => {
  // ...
}

// ❌ 不好
const handleEvent = (event: any) => {
  // ...
}
```

### 3. 命名規範

**組件命名**:
```
PascalCase: TodoInput.vue, TodoList.vue
```

**函數命名**:
```typescript
// 動詞開頭
const addTodo = () => {}
const deleteTodo = () => {}
const toggleTodo = () => {}

// 布爾值使用 is/has 前綴
const isCompleted = computed(() => {})
const hasTodos = computed(() => {})
```

**常量命名**:
```typescript
// 全大寫加下劃線
const STORAGE_KEY = 'vue-element-plus-todos'
const MAX_LENGTH = 200
```

### 4. 代碼組織

**邏輯分組**:
```typescript
<script setup lang="ts">
// 1. 導入
import { ref, computed } from 'vue'

// 2. Props 和 Emits
const props = defineProps<{ /* ... */ }>()
const emit = defineEmits<{ /* ... */ }>()

// 3. 響應式狀態
const todos = ref<Todo[]>([])

// 4. 計算屬性
const filteredTodos = computed(() => {})

// 5. 方法
const addTodo = () => {}

// 6. 生命週期
onMounted(() => {})

// 7. 監聽器
watch(todos, () => {})
</script>
```

### 5. 錯誤處理

```typescript
// 使用 try-catch
const loadTodos = (): void => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      todos.value = JSON.parse(saved)
    }
  } catch (error) {
    console.error('Failed to load todos:', error)
    ElMessage.error('載入失敗')
    todos.value = []
  }
}

// 處理異步錯誤
const fetchTodos = async (): Promise<void> => {
  try {
    const response = await fetch('/api/todos')
    if (!response.ok) {
      throw new Error('Failed to fetch')
    }
    todos.value = await response.json()
  } catch (error) {
    console.error('Error:', error)
    ElMessage.error('獲取數據失敗')
  }
}
```

### 6. 註釋和文檔

```typescript
/**
 * 添加新的待辦事項
 * @param text - 待辦事項文字內容
 */
const addTodo = (text: string): void => {
  // 創建新的待辦事項對象
  const newTodo: Todo = {
    id: Date.now(),
    text: text.trim(),
    completed: false,
    createdAt: Date.now()
  }

  // 添加到列表頂部
  todos.value.unshift(newTodo)
}
```

---

## 常見問題

### 1. 如何自定義 Element Plus 主題？

**方法一：使用 CSS 變量**
```css
:root {
  --el-color-primary: #your-color;
}
```

**方法二：使用 SCSS 變量**
```scss
// styles/element-variables.scss
@forward 'element-plus/theme-chalk/src/common/var.scss' with (
  $colors: (
    'primary': (
      'base': #your-color,
    ),
  ),
);

// main.ts
import './styles/element-variables.scss'
```

### 2. 如何減小打包體積？

**按需引入組件**:
```typescript
// vite.config.ts
import { defineConfig } from 'vite'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

export default defineConfig({
  plugins: [
    AutoImport({
      resolvers: [ElementPlusResolver()],
    }),
    Components({
      resolvers: [ElementPlusResolver()],
    }),
  ],
})
```

### 3. 如何處理表單驗證？

```vue
<script setup lang="ts">
import type { FormInstance, FormRules } from 'element-plus'

const formRef = ref<FormInstance>()

const form = reactive({
  text: ''
})

const rules: FormRules = {
  text: [
    { required: true, message: '請輸入內容', trigger: 'blur' },
    { min: 2, max: 200, message: '長度在 2 到 200 個字符', trigger: 'blur' }
  ]
}

const handleSubmit = async () => {
  if (!formRef.value) return

  await formRef.value.validate((valid) => {
    if (valid) {
      // 提交表單
    }
  })
}
</script>

<template>
  <el-form :model="form" :rules="rules" ref="formRef">
    <el-form-item prop="text">
      <el-input v-model="form.text" />
    </el-form-item>
    <el-button @click="handleSubmit">提交</el-button>
  </el-form>
</template>
```

### 4. 如何實現國際化？

```typescript
// main.ts
import ElementPlus from 'element-plus'
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
import en from 'element-plus/dist/locale/en.mjs'

const locale = ref(zhCn)

app.use(ElementPlus, { locale })
```

### 5. 深色模式不生效？

確保導入深色模式樣式：
```typescript
// main.ts
import 'element-plus/theme-chalk/dark/css-vars.css'
```

並在 HTML 元素上添加 `dark` 類：
```typescript
document.documentElement.classList.add('dark')
```

---

## 擴展建議

### 1. 添加路由

```bash
npm install vue-router
```

```typescript
// router/index.ts
import { createRouter, createWebHistory } from 'vue-router'
import TodoList from '../views/TodoList.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: TodoList },
    { path: '/completed', component: () => import('../views/Completed.vue') }
  ]
})

export default router
```

### 2. 添加狀態管理

```bash
npm install pinia
```

```typescript
// stores/todo.ts
import { defineStore } from 'pinia'

export const useTodoStore = defineStore('todo', {
  state: () => ({
    todos: [] as Todo[]
  }),

  getters: {
    activeTodos: (state) => state.todos.filter(t => !t.completed),
    completedTodos: (state) => state.todos.filter(t => t.completed)
  },

  actions: {
    addTodo(text: string) {
      this.todos.push({
        id: Date.now(),
        text,
        completed: false,
        createdAt: Date.now()
      })
    }
  }
})
```

### 3. 添加 API 集成

```typescript
// api/todos.ts
export const todoApi = {
  async fetchTodos(): Promise<Todo[]> {
    const response = await fetch('/api/todos')
    return response.json()
  },

  async createTodo(todo: Omit<Todo, 'id'>): Promise<Todo> {
    const response = await fetch('/api/todos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(todo)
    })
    return response.json()
  },

  async updateTodo(id: number, updates: Partial<Todo>): Promise<Todo> {
    const response = await fetch(`/api/todos/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    })
    return response.json()
  },

  async deleteTodo(id: number): Promise<void> {
    await fetch(`/api/todos/${id}`, { method: 'DELETE' })
  }
}
```

### 4. 添加單元測試

```bash
npm install -D vitest @vue/test-utils
```

```typescript
// __tests__/TodoInput.spec.ts
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import TodoInput from '../components/TodoInput.vue'

describe('TodoInput', () => {
  it('emits add-todo event when button clicked', async () => {
    const wrapper = mount(TodoInput)
    const input = wrapper.find('input')
    const button = wrapper.find('button')

    await input.setValue('New todo')
    await button.trigger('click')

    expect(wrapper.emitted('addTodo')).toBeTruthy()
    expect(wrapper.emitted('addTodo')?.[0]).toEqual(['New todo'])
  })
})
```

### 5. 添加拖拽排序

```bash
npm install vuedraggable@next
```

```vue
<script setup lang="ts">
import draggable from 'vuedraggable'

const todos = ref<Todo[]>([])
</script>

<template>
  <draggable v-model="todos" item-key="id">
    <template #item="{ element }">
      <TodoItem :todo="element" />
    </template>
  </draggable>
</template>
```

---

## 總結

這個 Vue 3 + Element Plus Todo List 應用展示了：

### 技術亮點
- ✅ Vue 3 Composition API 最佳實踐
- ✅ Element Plus 組件庫完整應用
- ✅ TypeScript 類型安全
- ✅ 響應式設計
- ✅ 深色模式支持
- ✅ LocalStorage 持久化
- ✅ 現代化 UI/UX

### 學習收穫
- 掌握 Vue 3 Composition API
- 熟悉 Element Plus 組件使用
- 理解 TypeScript 在 Vue 中的應用
- 學習組件化開發思想
- 掌握狀態管理和數據持久化

### 延伸學習
- Vue Router 路由管理
- Pinia 狀態管理
- Vitest 單元測試
- API 集成和數據獲取
- PWA 漸進式 Web 應用

---

## 參考資源

### 官方文檔
- [Vue 3 官方文檔](https://vuejs.org/)
- [Element Plus 官方文檔](https://element-plus.org/)
- [TypeScript 官方文檔](https://www.typescriptlang.org/)
- [Vite 官方文檔](https://vitejs.dev/)

### 社區資源
- [Vue.js Discord](https://discord.com/invite/vue)
- [Element Plus GitHub](https://github.com/element-plus/element-plus)
- [Awesome Vue](https://github.com/vuejs/awesome-vue)

### 教程和文章
- [Vue 3 Composition API 指南](https://vuejs.org/guide/extras/composition-api-faq.html)
- [Element Plus 快速上手](https://element-plus.org/zh-CN/guide/quickstart.html)
- [TypeScript 與 Vue 3](https://vuejs.org/guide/typescript/overview.html)

---

## 許可證

MIT License

---

**享受使用 Vue 3 + Element Plus 開發的樂趣！** 🎉
