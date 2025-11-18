# React + Redux Toolkit Todo List

這是一個使用 **React** 和 **Redux Toolkit** 建立的現代化 Todo List 應用程式，展示了如何使用 Redux Toolkit 進行狀態管理。

## 目錄結構

```
01-react-redux/
├── src/
│   ├── components/          # React 組件
│   │   ├── TodoForm.tsx     # 新增 Todo 表單
│   │   ├── TodoItem.tsx     # 單個 Todo 項目
│   │   ├── TodoList.tsx     # Todo 列表
│   │   └── TodoFilters.tsx  # 過濾器和統計
│   ├── features/
│   │   └── todos/
│   │       └── todosSlice.ts # Redux Slice（狀態 + Actions + Reducers）
│   ├── store/
│   │   ├── index.ts         # Redux Store 配置
│   │   └── hooks.ts         # 自訂 TypeScript Hooks
│   ├── App.tsx              # 主應用程式組件
│   ├── main.tsx             # 應用程式入口
│   └── index.css            # 全域樣式
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

## Redux Toolkit 特色

### 1. **createSlice - 減少樣板代碼**

傳統 Redux 需要分別定義 action types、action creators 和 reducers，非常繁瑣：

```typescript
// 傳統 Redux 寫法
const ADD_TODO = 'ADD_TODO'

const addTodo = (text: string) => ({
  type: ADD_TODO,
  payload: text
})

const todosReducer = (state = [], action) => {
  switch (action.type) {
    case ADD_TODO:
      return [...state, newTodo]
    default:
      return state
  }
}
```

使用 Redux Toolkit 的 **createSlice**，一次定義完成：

```typescript
// Redux Toolkit 寫法
const todosSlice = createSlice({
  name: 'todos',
  initialState,
  reducers: {
    addTodo: (state, action: PayloadAction<string>) => {
      // 直接「修改」state，Immer 會處理不可變性
      state.items.push(newTodo)
    }
  }
})
```

**優點：**
- 自動生成 action creators 和 action types
- 減少 80% 的樣板代碼
- 使用 Immer 允許「直接修改」state

### 2. **Immer 內建 - 可變式語法**

Redux Toolkit 內建了 [Immer](https://immerjs.github.io/immer/)，讓你可以用「看起來像修改」的語法來更新 state：

```typescript
// ✅ Redux Toolkit with Immer - 簡潔直觀
toggleTodo: (state, action: PayloadAction<string>) => {
  const todo = state.items.find(item => item.id === action.payload)
  if (todo) {
    todo.completed = !todo.completed  // 看起來在修改，實際產生新物件
  }
}

// ❌ 傳統 Redux - 繁瑣的不可變更新
case TOGGLE_TODO:
  return {
    ...state,
    items: state.items.map(todo =>
      todo.id === action.payload
        ? { ...todo, completed: !todo.completed }
        : todo
    )
  }
```

### 3. **configureStore - 簡化 Store 設定**

```typescript
// Redux Toolkit
export const store = configureStore({
  reducer: {
    todos: todosReducer,
  },
})
```

**自動包含：**
- Redux DevTools Extension 支援
- redux-thunk 中間件（支援非同步 actions）
- 開發環境的中間件檢查（檢測常見錯誤）

### 4. **TypeScript 支援**

Redux Toolkit 從設計上就完全支援 TypeScript：

```typescript
// 自動推斷類型
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

// 類型安全的 hooks
export const useAppDispatch: () => AppDispatch = useDispatch
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
```

## Redux 狀態管理原理

### 核心概念

Redux 遵循**單向資料流**原則：

```
┌──────────┐
│   View   │ ──dispatch(action)──> ┌────────┐
└──────────┘                        │ Action │
     ↑                              └────────┘
     │                                   │
     │                                   ↓
     │                              ┌─────────┐
     │                              │ Reducer │
     │                              └─────────┘
     │                                   │
     │                                   ↓
     │                              ┌───────┐
     └────────── subscribe ─────────│ Store │
                                    └───────┘
```

### 1. **Store（狀態容器）**

Store 是應用程式的單一資料源（Single Source of Truth）：

```typescript
const store = configureStore({
  reducer: {
    todos: todosReducer,
    user: userReducer,
    // 其他 reducers...
  }
})
```

### 2. **State（狀態）**

State 是一個不可變的 JavaScript 物件：

```typescript
{
  todos: {
    items: [
      { id: '1', text: 'Learn Redux', completed: false },
      { id: '2', text: 'Build App', completed: true }
    ],
    filter: 'all'
  }
}
```

### 3. **Actions（動作）**

Actions 是描述「發生了什麼事」的普通物件：

```typescript
// Action 結構
{
  type: 'todos/addTodo',
  payload: 'Learn Redux Toolkit'
}

// 使用 action creator
dispatch(addTodo('Learn Redux Toolkit'))
```

### 4. **Reducers（歸約器）**

Reducers 是純函數，定義「如何更新 state」：

```typescript
// (previousState, action) => newState
const todosReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'todos/addTodo':
      return { ...state, items: [...state.items, newTodo] }
    default:
      return state
  }
}
```

**純函數特性：**
- 相同輸入 → 相同輸出
- 不修改參數
- 不產生副作用（API 呼叫、路由跳轉等）

### 5. **Selectors（選擇器）**

Selectors 用於從 state 中提取和計算資料：

```typescript
// 基本 selector
export const selectAllTodos = (state: RootState) => state.todos.items

// 衍生 selector（記憶化計算）
export const selectFilteredTodos = (state: RootState) => {
  const { items, filter } = state.todos
  return items.filter(todo =>
    filter === 'all' ||
    (filter === 'active' && !todo.completed) ||
    (filter === 'completed' && todo.completed)
  )
}
```

## Redux 三大原則

### 1. **單一資料源（Single Source of Truth）**

整個應用程式的 state 儲存在單一 store 的物件樹中。

**優點：**
- 易於除錯和追蹤狀態變化
- 易於實現 undo/redo
- 伺服器端渲染更容易

### 2. **State 是唯讀的（State is Read-Only）**

改變 state 的唯一方法是發送一個 action。

```typescript
// ❌ 錯誤：直接修改 state
state.todos.push(newTodo)

// ✅ 正確：dispatch action
dispatch(addTodo('New Todo'))
```

### 3. **使用純函數進行更新（Changes are Made with Pure Functions）**

Reducers 必須是純函數。

```typescript
// ✅ 純函數
const reducer = (state, action) => {
  return { ...state, value: action.payload }
}

// ❌ 不純函數（有副作用）
const reducer = (state, action) => {
  fetch('/api/data')  // 副作用！
  return state
}
```

## 資料流程範例

以「新增 Todo」為例：

```typescript
// 1. 使用者在表單輸入並提交
const handleSubmit = (text: string) => {
  // 2. Dispatch action
  dispatch(addTodo(text))
}

// 3. Action 傳送到 reducer
const todosSlice = createSlice({
  name: 'todos',
  initialState,
  reducers: {
    // 4. Reducer 根據 action 更新 state
    addTodo: (state, action) => {
      state.items.push({
        id: Date.now().toString(),
        text: action.payload,
        completed: false
      })
    }
  }
})

// 5. Store 更新後，通知所有訂閱者
// 6. React 組件重新渲染
const todos = useAppSelector(selectAllTodos)
```

## Redux vs Context API

| 特性 | Redux | Context API |
|------|-------|-------------|
| **學習曲線** | 較陡峭 | 較平緩 |
| **樣板代碼** | 較多（Redux Toolkit 減少很多） | 較少 |
| **效能** | 優秀（細粒度更新） | 一般（整個 context 重渲染） |
| **除錯工具** | Redux DevTools | React DevTools |
| **中間件** | 豐富的生態系統 | 需自己實作 |
| **適用場景** | 大型應用、複雜狀態 | 中小型應用、簡單狀態 |

## 何時使用 Redux？

**適合使用：**
- 應用程式有大量狀態需要在多處使用
- 狀態更新邏輯複雜
- 需要強大的除錯工具
- 團隊規模較大，需要標準化的狀態管理模式

**不適合使用：**
- 應用程式很簡單
- 狀態只在少數組件間共享
- 團隊不熟悉 Redux，學習成本大於收益

## 功能特色

- ✅ 新增、編輯、刪除 Todo
- ✅ 切換完成狀態
- ✅ 過濾器（全部/進行中/已完成）
- ✅ 統計資訊
- ✅ 全選/取消全選
- ✅ 清除已完成項目
- ✅ LocalStorage 持久化
- ✅ TypeScript 類型安全
- ✅ 響應式設計

## 安裝與執行

```bash
# 安裝相依套件
npm install

# 啟動開發伺服器
npm run dev

# 建置生產版本
npm run build

# 預覽生產版本
npm run preview
```

## 核心技術

- **React 18** - UI 函式庫
- **Redux Toolkit** - 現代 Redux 狀態管理
- **TypeScript** - 類型安全
- **Vite** - 快速建置工具

## Redux DevTools

安裝 [Redux DevTools Extension](https://github.com/reduxjs/redux-devtools) 來獲得強大的除錯體驗：

- ⏱️ 時間旅行除錯（Time-Travel Debugging）
- 📊 狀態變化視覺化
- 🔍 Action 歷史記錄
- 📸 匯入/匯出狀態快照

## 學習資源

- [Redux Toolkit 官方文件](https://redux-toolkit.js.org/)
- [Redux 官方文件](https://redux.js.org/)
- [Redux Style Guide](https://redux.js.org/style-guide/)
- [Redux Essentials Tutorial](https://redux.js.org/tutorials/essentials/part-1-overview-app)

## 授權

MIT License
