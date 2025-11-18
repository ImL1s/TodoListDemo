# Redux Toolkit Todo List

一個使用 React + TypeScript + Redux Toolkit 打造的現代化 Todo List 應用程式，展示了 Redux Toolkit 的最佳實踐和強大功能。

![React](https://img.shields.io/badge/React-18.2-61dafb?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.2-3178c6?logo=typescript)
![Redux Toolkit](https://img.shields.io/badge/Redux_Toolkit-2.0-764abc?logo=redux)
![Vite](https://img.shields.io/badge/Vite-5.0-646cff?logo=vite)

## 📋 目錄

- [Redux Toolkit 特色](#redux-toolkit-特色)
- [功能列表](#功能列表)
- [安裝和運行](#安裝和運行)
- [專案結構](#專案結構)
- [與傳統 Redux 的比較](#與傳統-redux-的比較)
- [核心概念](#核心概念)
- [學習資源](#學習資源)

## 🚀 Redux Toolkit 特色

Redux Toolkit (RTK) 是 Redux 官方推薦的現代化 Redux 開發工具集，解決了傳統 Redux 的諸多痛點：

### 1. **大幅簡化樣板代碼**
- 使用 `createSlice` 自動生成 action creators 和 reducers
- 不需要手動定義 action types 和 action creators
- 自動處理不可變更新邏輯（使用 Immer）

### 2. **內建最佳實踐**
- 預設整合 Redux DevTools Extension
- 自動包含 redux-thunk middleware
- 開發環境下自動進行序列化和不可變性檢查

### 3. **優秀的 TypeScript 支援**
- 完整的類型推斷
- 減少手動類型定義
- 類型安全的 hooks

### 4. **強大的非同步處理**
- `createAsyncThunk` 簡化非同步邏輯
- 自動處理 pending/fulfilled/rejected 狀態
- 內建請求取消和競態處理

### 5. **RTK Query（可選）**
- 強大的資料獲取和快取解決方案
- 自動生成 hooks
- 樂觀更新支援

## ✨ 功能列表

- ✅ **新增待辦事項** - 輸入框快速新增
- ✅ **編輯待辦事項** - 雙擊或點擊編輯按鈕
- ✅ **刪除待辦事項** - 單個刪除或批量清除已完成
- ✅ **切換完成狀態** - 單個切換或全部切換
- ✅ **篩選功能** - 全部/進行中/已完成三種視圖
- ✅ **統計資訊** - 即時顯示總計、進行中、已完成數量
- ✅ **localStorage 持久化** - 自動儲存，刷新不丟失
- ✅ **非同步操作示範** - 使用 createAsyncThunk
- ✅ **響應式設計** - 完美支援桌面和移動裝置
- ✅ **鍵盤快捷鍵** - Enter 儲存，Esc 取消編輯

## 📦 安裝和運行

### 前置需求

- Node.js 18+
- npm 或 yarn 或 pnpm

### 安裝步驟

1. **安裝依賴**
   ```bash
   npm install
   # 或
   yarn install
   # 或
   pnpm install
   ```

2. **啟動開發伺服器**
   ```bash
   npm run dev
   # 或
   yarn dev
   # 或
   pnpm dev
   ```

3. **開啟瀏覽器**

   訪問 http://localhost:5173

4. **建構生產版本**
   ```bash
   npm run build
   # 或
   yarn build
   # 或
   pnpm build
   ```

5. **預覽生產版本**
   ```bash
   npm run preview
   # 或
   yarn preview
   # 或
   pnpm preview
   ```

## 📁 專案結構

```
01-react-redux-toolkit/
├── src/
│   ├── app/                    # Redux store 配置
│   │   ├── store.ts           # Store 配置（configureStore）
│   │   └── hooks.ts           # 類型化的 Redux hooks
│   │
│   ├── features/              # 功能模組（按功能組織）
│   │   └── todos/             # Todo 功能模組
│   │       ├── todosSlice.ts  # Redux slice（state、reducers、actions）
│   │       ├── TodoList.tsx   # Todo 列表組件
│   │       ├── TodoItem.tsx   # Todo 項目組件
│   │       ├── TodoInput.tsx  # 輸入組件
│   │       └── TodoFilters.tsx # 篩選組件
│   │
│   ├── types/                 # TypeScript 類型定義
│   │   └── todo.ts           # Todo 相關類型
│   │
│   ├── styles/               # 樣式文件
│   │   └── App.css          # 主要樣式
│   │
│   ├── App.tsx              # 根組件
│   └── main.tsx             # 應用程式入口點
│
├── index.html               # HTML 模板
├── package.json            # 專案配置和依賴
├── tsconfig.json          # TypeScript 配置
├── vite.config.ts         # Vite 配置
└── README.md              # 專案說明文件
```

### 目錄組織原則

- **按功能組織（Feature-based）**：每個功能模組包含相關的 slice、組件和邏輯
- **關注點分離**：Redux 邏輯、組件、類型分別管理
- **可擴展性**：新增功能只需在 features/ 下新增目錄

## 🆚 與傳統 Redux 的比較

### 傳統 Redux 寫法

```typescript
// ❌ 傳統 Redux - 繁瑣且容易出錯

// 1. 定義 action types
const ADD_TODO = 'ADD_TODO';
const TOGGLE_TODO = 'TOGGLE_TODO';

// 2. 定義 action creators
const addTodo = (text: string) => ({
  type: ADD_TODO,
  payload: { id: Date.now(), text, completed: false }
});

const toggleTodo = (id: number) => ({
  type: TOGGLE_TODO,
  payload: id
});

// 3. 定義 reducer（需要手動處理不可變更新）
const todosReducer = (state = [], action) => {
  switch (action.type) {
    case ADD_TODO:
      return [...state, action.payload]; // 手動複製陣列
    case TOGGLE_TODO:
      return state.map(todo => // 手動複製物件
        todo.id === action.payload
          ? { ...todo, completed: !todo.completed }
          : todo
      );
    default:
      return state;
  }
};

// 4. 建立 store
const store = createStore(
  combineReducers({ todos: todosReducer }),
  applyMiddleware(thunk)
);
```

### Redux Toolkit 寫法

```typescript
// ✅ Redux Toolkit - 簡潔且安全

import { createSlice } from '@reduxjs/toolkit';

const todosSlice = createSlice({
  name: 'todos',
  initialState: [],
  reducers: {
    // 直接修改 state（Immer 自動處理不可變更新）
    addTodo: (state, action) => {
      state.push({
        id: Date.now(),
        text: action.payload,
        completed: false
      });
    },
    toggleTodo: (state, action) => {
      const todo = state.find(t => t.id === action.payload);
      if (todo) {
        todo.completed = !todo.completed; // 看起來像可變更新
      }
    }
  }
});

// 自動生成 action creators
export const { addTodo, toggleTodo } = todosSlice.actions;

// 建立 store（自動包含 DevTools 和 thunk）
const store = configureStore({
  reducer: {
    todos: todosSlice.reducer
  }
});
```

### 程式碼量對比

| 功能 | 傳統 Redux | Redux Toolkit | 減少比例 |
|------|-----------|---------------|---------|
| 基本 CRUD | ~200 行 | ~80 行 | **60%** |
| 非同步操作 | ~150 行 | ~40 行 | **73%** |
| 類型定義 | ~100 行 | ~30 行 | **70%** |

## 💡 核心概念

### 1. createSlice

`createSlice` 是 RTK 的核心 API，自動生成 action creators 和 reducers：

```typescript
const todosSlice = createSlice({
  name: 'todos',              // slice 名稱
  initialState,               // 初始狀態
  reducers: {                 // reducers 定義
    addTodo: (state, action) => {
      // 使用 Immer，可以直接修改 state
      state.items.push(action.payload);
    }
  },
  extraReducers: (builder) => {  // 處理外部 actions
    builder.addCase(loadTodos.fulfilled, (state, action) => {
      state.items = action.payload;
    });
  }
});
```

### 2. createAsyncThunk

處理非同步邏輯的標準方式：

```typescript
export const loadTodos = createAsyncThunk(
  'todos/loadTodos',          // action type 前綴
  async () => {
    // 非同步邏輯
    const response = await fetch('/api/todos');
    return response.json();
  }
);

// 自動生成三個 action types:
// - todos/loadTodos/pending
// - todos/loadTodos/fulfilled
// - todos/loadTodos/rejected
```

### 3. configureStore

簡化 store 配置，自動包含最佳實踐：

```typescript
export const store = configureStore({
  reducer: {
    todos: todosReducer,
    // 可以輕鬆添加更多 reducers
  },
  // 自動包含：
  // - Redux DevTools Extension
  // - redux-thunk middleware
  // - 序列化檢查 middleware（開發環境）
  // - 不可變性檢查 middleware（開發環境）
});
```

### 4. 類型化 Hooks

使用類型化的 hooks 獲得更好的 TypeScript 支援：

```typescript
// hooks.ts
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

// 在組件中使用
const dispatch = useAppDispatch();           // 完整類型推斷
const todos = useAppSelector(selectTodos);   // 自動推斷返回類型
```

### 5. Selectors

使用 selectors 封裝狀態讀取邏輯：

```typescript
// 基本 selector
export const selectAllTodos = (state: RootState) => state.todos.items;

// 衍生 selector
export const selectFilteredTodos = (state: RootState) => {
  const { items, filter } = state.todos;
  switch (filter) {
    case 'active':
      return items.filter(todo => !todo.completed);
    case 'completed':
      return items.filter(todo => todo.completed);
    default:
      return items;
  }
};

// 在組件中使用
const todos = useAppSelector(selectFilteredTodos);
```

## 🎯 最佳實踐

### 1. 狀態結構設計

```typescript
// ✅ 好的設計 - 扁平化、正規化
{
  todos: {
    items: [...],
    filter: 'all',
    editingId: null
  }
}

// ❌ 不好的設計 - 巢狀過深
{
  todos: {
    all: {
      active: [...],
      completed: [...]
    }
  }
}
```

### 2. Slice 組織

- 每個功能一個 slice
- Slice 應該是自包含的
- 相關邏輯放在一起

### 3. 非同步操作

- 使用 `createAsyncThunk` 處理非同步邏輯
- 在 `extraReducers` 中處理非同步狀態
- 考慮錯誤處理和載入狀態

### 4. 性能優化

- 使用 `reselect` 創建 memoized selectors（大型應用）
- 避免在 selectors 中進行複雜計算
- 使用 `React.memo` 優化組件渲染

## 🔧 進階功能

### RTK Query 整合（示範）

如果需要更強大的資料獲取能力，可以整合 RTK Query：

```typescript
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const todosApi = createApi({
  reducerPath: 'todosApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
  endpoints: (builder) => ({
    getTodos: builder.query({
      query: () => 'todos',
    }),
    addTodo: builder.mutation({
      query: (todo) => ({
        url: 'todos',
        method: 'POST',
        body: todo,
      }),
    }),
  }),
});

// 自動生成 hooks
export const { useGetTodosQuery, useAddTodoMutation } = todosApi;
```

## 📚 學習資源

### 官方文檔

- [Redux Toolkit 官方文檔](https://redux-toolkit.js.org/) - 最權威的學習資源
- [Redux 官方文檔](https://redux.js.org/) - Redux 核心概念
- [RTK Query 文檔](https://redux-toolkit.js.org/rtk-query/overview) - 資料獲取解決方案

### 教程和指南

- [Redux Essentials 教程](https://redux.js.org/tutorials/essentials/part-1-overview-concepts) - 官方推薦教程
- [Redux Fundamentals](https://redux.js.org/tutorials/fundamentals/part-1-overview) - 深入理解 Redux
- [TypeScript Quick Start](https://redux-toolkit.js.org/tutorials/typescript) - TypeScript 整合

### 視頻資源

- [Redux Toolkit 完整教程](https://www.youtube.com/results?search_query=redux+toolkit+tutorial) - YouTube 搜尋
- [Redux 官方頻道](https://www.youtube.com/c/ReduxJS) - 官方視頻

### 相關工具

- [Redux DevTools Extension](https://github.com/reduxjs/redux-devtools) - 強大的除錯工具
- [Reselect](https://github.com/reduxjs/reselect) - Selector 庫
- [Immer](https://immerjs.github.io/immer/) - 不可變狀態處理（RTK 內建）

### 社群資源

- [Redux GitHub](https://github.com/reduxjs/redux-toolkit) - 原始碼和問題追蹤
- [Stack Overflow](https://stackoverflow.com/questions/tagged/redux-toolkit) - 問答社群
- [Reddit r/reactjs](https://www.reddit.com/r/reactjs/) - React 社群討論

## 🔍 常見問題

### Q: 什麼時候應該使用 Redux Toolkit？

A: 當您的應用符合以下條件時：
- 需要在多個組件間共享狀態
- 狀態更新邏輯複雜
- 需要時間旅行除錯
- 團隊熟悉 Redux 模式

### Q: Redux Toolkit vs Zustand/Jotai/Recoil？

A:
- **Redux Toolkit**: 適合大型應用，生態系統完整，學習曲線較陡
- **Zustand**: 輕量級，API 簡單，適合中小型應用
- **Jotai/Recoil**: 原子化狀態，適合需要細粒度更新的應用

### Q: 是否還需要學習傳統 Redux？

A: 不需要。Redux Toolkit 是 Redux 團隊推薦的標準寫法，直接學習 RTK 即可。

### Q: RTK Query vs React Query？

A:
- **RTK Query**: 與 Redux 深度整合，適合已使用 Redux 的專案
- **React Query**: 獨立庫，功能更豐富，社群更大

## 📝 開發筆記

### localStorage 持久化實現

```typescript
// 儲存
const saveTodosToStorage = (todos: Todo[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
  } catch (error) {
    console.error('Failed to save:', error);
  }
};

// 在每個修改 state 的 reducer 中呼叫
reducers: {
  addTodo: (state, action) => {
    state.items.push(action.payload);
    saveTodosToStorage(state.items); // 自動儲存
  }
}
```

### 編輯功能實現

使用 `editingId` 追蹤當前編輯的項目：

```typescript
state: {
  editingId: string | null  // 儲存正在編輯的 todo ID
}

// 雙擊進入編輯模式
<span onDoubleClick={() => dispatch(startEditing(todo.id))}>
  {todo.text}
</span>

// 根據 editingId 判斷是否顯示編輯輸入框
{isEditing ? <input ... /> : <span ... />}
```

## 🎨 自訂和擴展

### 添加新功能

1. 在 `todosSlice.ts` 添加新的 reducer
2. 創建對應的組件
3. 在 `App.tsx` 中整合

### 主題自訂

修改 `App.css` 中的 CSS 變數：

```css
:root {
  --primary-color: #your-color;
  --secondary-color: #your-color;
}
```

## 📄 授權

MIT License

## 🤝 貢獻

歡迎提交 Issue 和 Pull Request！

---

**Happy Coding! 🚀**

如有問題或建議，歡迎在 Issues 中討論。
