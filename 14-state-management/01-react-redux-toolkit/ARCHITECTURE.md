# 🏗️ 架構說明

本文檔詳細說明專案的架構設計和技術決策。

## 目錄結構設計

### Feature-based 組織

```
src/
├── app/              # 全域配置
│   ├── store.ts     # Redux store
│   └── hooks.ts     # 類型化 hooks
│
├── features/        # 功能模組
│   └── todos/       # Todo 功能
│       ├── todosSlice.ts  # Redux 邏輯
│       ├── TodoList.tsx   # 列表組件
│       ├── TodoItem.tsx   # 項目組件
│       ├── TodoInput.tsx  # 輸入組件
│       └── TodoFilters.tsx # 篩選組件
│
├── types/           # 類型定義
└── styles/          # 樣式文件
```

### 為什麼選擇 Feature-based？

✅ **優點**:
- 相關代碼集中在一起
- 易於尋找和維護
- 利於團隊協作
- 功能獨立，易於移除或重構

❌ **傳統按類型組織的缺點**:
- 修改功能需要跨多個目錄
- 代碼分散，不易維護
- 難以理解功能邊界

## Redux 架構

### 狀態樹設計

```typescript
{
  todos: {
    items: Todo[],        // 待辦事項列表
    filter: FilterType,   // 當前篩選類型
    editingId: string | null  // 正在編輯的 ID
  }
}
```

### 設計原則

1. **扁平化結構** - 避免深層巢狀
2. **單一數據源** - 每個數據只存一份
3. **正規化數據** - 如需要可使用 `normalizr`
4. **最小化狀態** - 衍生數據使用 selector 計算

## 組件架構

### 組件分層

```
App (容器組件)
├── TodoInput (輸入組件)
├── TodoFilters (篩選組件)
└── TodoList (列表組件)
    └── TodoItem (項目組件) × N
```

### 組件職責

| 組件 | 職責 | Redux 連接 |
|------|------|-----------|
| App | 佈局、組合 | ❌ |
| TodoInput | 輸入、新增 | ✅ dispatch |
| TodoFilters | 篩選、統計 | ✅ dispatch + selector |
| TodoList | 列表渲染、載入 | ✅ dispatch + selector |
| TodoItem | 單項展示、操作 | ✅ dispatch + selector |

## 數據流

### 單向數據流

```
使用者操作
    ↓
dispatch(action)
    ↓
Redux Middleware (thunk)
    ↓
Reducer 更新 State
    ↓
Selector 計算衍生數據
    ↓
組件重新渲染
```

### 完整流程示例

```typescript
// 1. 使用者點擊新增按鈕
<button onClick={handleSubmit}>新增</button>

// 2. 組件 dispatch action
const handleSubmit = () => {
  dispatch(addTodo(text));
};

// 3. Reducer 處理 action
reducers: {
  addTodo: (state, action) => {
    state.items.push(action.payload);
    saveTodosToStorage(state.items);  // 副作用
  }
}

// 4. Selector 計算新數據
const todos = useAppSelector(selectFilteredTodos);

// 5. 組件重新渲染
{todos.map(todo => <TodoItem todo={todo} />)}
```

## TypeScript 整合

### 類型推斷鏈

```typescript
// 1. 定義基礎類型
interface Todo { ... }

// 2. Slice 狀態類型
interface TodosState {
  items: Todo[];
  ...
}

// 3. 從 Store 推斷 RootState
type RootState = ReturnType<typeof store.getState>;

// 4. 類型化 Hooks
const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

// 5. 組件中獲得完整類型推斷
const todos = useAppSelector(state => state.todos.items);  // Todo[]
```

### 類型安全保證

- ✅ Action payload 類型檢查
- ✅ Reducer 返回值類型檢查
- ✅ Selector 返回類型推斷
- ✅ Dispatch 參數類型檢查

## 性能優化

### 已實現的優化

1. **Selector Memoization**
   ```typescript
   // Redux Toolkit 自動優化，只在依賴變化時重新計算
   export const selectFilteredTodos = (state: RootState) => { ... };
   ```

2. **組件優化**
   ```typescript
   // 可選：使用 React.memo 防止不必要的重渲染
   export const TodoItem = React.memo(({ todo }) => { ... });
   ```

3. **事件處理優化**
   ```typescript
   // 使用 useCallback 緩存回調函數
   const handleToggle = useCallback(() => {
     dispatch(toggleTodo(todo.id));
   }, [dispatch, todo.id]);
   ```

### 進階優化建議

對於大型應用（1000+ todos）：

1. **虛擬化列表** - 使用 `react-window`
2. **Reselect** - 創建複雜的 memoized selectors
3. **Code Splitting** - 按路由分割代碼
4. **Web Workers** - 將計算移至 worker

## 副作用處理

### localStorage 同步

```typescript
// 策略：在每個修改 action 中同步儲存
reducers: {
  addTodo: (state, action) => {
    state.items.push(action.payload);
    saveTodosToStorage(state.items);  // 同步副作用
  }
}

// 載入使用 createAsyncThunk（示範非同步）
export const loadTodos = createAsyncThunk(
  'todos/loadTodos',
  async () => {
    return loadTodosFromStorage();
  }
);
```

### 其他副作用選項

- **Redux Middleware** - 全域副作用處理
- **createListenerMiddleware** - RTK 1.8+ 推薦
- **Redux-Saga** - 複雜非同步流程
- **Redux-Observable** - RxJS 風格

## 測試策略

### 測試金字塔

```
        E2E Tests (少量)
          /      \
    Integration Tests (適量)
      /              \
  Unit Tests (大量)
```

### 推薦測試工具

- **單元測試**: Vitest + Testing Library
- **整合測試**: Testing Library
- **E2E 測試**: Playwright / Cypress

### 測試示例

```typescript
// Reducer 測試
import { todosSlice, addTodo } from './todosSlice';

describe('todosSlice', () => {
  it('should add todo', () => {
    const initialState = { items: [], filter: 'all', editingId: null };
    const state = todosSlice.reducer(initialState, addTodo('test'));
    expect(state.items).toHaveLength(1);
  });
});

// 組件測試
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { TodoList } from './TodoList';

test('renders todo list', () => {
  render(
    <Provider store={store}>
      <TodoList />
    </Provider>
  );
  expect(screen.getByText(/暫無待辦/i)).toBeInTheDocument();
});
```

## 擴展建議

### 添加新功能

1. **標籤系統**
   ```typescript
   interface Todo {
     ...
     tags: string[];
   }
   ```

2. **優先級**
   ```typescript
   interface Todo {
     ...
     priority: 'low' | 'medium' | 'high';
   }
   ```

3. **截止日期**
   ```typescript
   interface Todo {
     ...
     dueDate: number | null;
   }
   ```

### 整合後端 API

使用 RTK Query：

```typescript
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const todosApi = createApi({
  reducerPath: 'todosApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
  endpoints: (builder) => ({
    getTodos: builder.query<Todo[], void>({
      query: () => 'todos',
    }),
    addTodo: builder.mutation<Todo, Partial<Todo>>({
      query: (body) => ({
        url: 'todos',
        method: 'POST',
        body,
      }),
    }),
  }),
});
```

## 最佳實踐檢查清單

- ✅ 使用 TypeScript 進行類型安全
- ✅ Feature-based 目錄結構
- ✅ 使用 createSlice 簡化代碼
- ✅ 使用類型化 hooks
- ✅ Selector 封裝狀態邏輯
- ✅ 避免在 reducer 中執行副作用
- ✅ 保持狀態扁平化
- ✅ 使用 createAsyncThunk 處理非同步
- ✅ 添加適當的錯誤處理
- ✅ 編寫清晰的註釋

## 參考資源

- [Redux Style Guide](https://redux.js.org/style-guide/)
- [RTK Best Practices](https://redux-toolkit.js.org/usage/usage-guide)
- [React-Redux Hooks](https://react-redux.js.org/api/hooks)

---

**持續改進，保持代碼品質！** 🚀
