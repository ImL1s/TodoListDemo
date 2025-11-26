# React + Zustand Todo List

極簡狀態管理方案 - 使用 Zustand 構建的待辦事項應用

## 🎯 專案概述

這是一個使用 **React 18** + **Zustand 4** + **TypeScript** 構建的 Todo List 應用，展示了 Zustand 作為極簡狀態管理庫的核心優勢。

## 🌟 Zustand 特色

### 1. **極簡 API**
- 只需要 `create` 函數即可創建 store
- 狀態更新直接調用方法，無需 dispatch
- 學習曲線平緩，5 分鐘上手

### 2. **無需 Provider**
```tsx
// ❌ Redux 需要
<Provider store={store}>
  <App />
</Provider>

// ✅ Zustand 直接使用
<App />
```

### 3. **TypeScript 友好**
- 完整的類型推斷
- 單一接口定義即可
- 無需複雜的類型體操

### 4. **性能優秀**
- 選擇性訂閱，避免不必要的重渲染
- 自動優化更新
- 比 Redux 更高效

### 5. **內置 Middleware**
- `persist`：自動持久化
- `devtools`：Redux DevTools 支持
- `immer`：不可變數據支持

## 📊 Zustand vs Redux 詳細對比

### 代碼量對比

#### Redux (約 200+ 行)

**Types (types.ts - 30 行)**
```typescript
// Action Types
export const ADD_TODO = 'ADD_TODO';
export const TOGGLE_TODO = 'TOGGLE_TODO';
export const DELETE_TODO = 'DELETE_TODO';
// ... 更多 action types

// Action Interfaces
interface AddTodoAction {
  type: typeof ADD_TODO;
  payload: string;
}
// ... 更多 action interfaces

export type TodoActionTypes =
  | AddTodoAction
  | ToggleTodoAction
  | DeleteTodoAction;
```

**Actions (actions.ts - 40 行)**
```typescript
export const addTodo = (text: string): TodoActionTypes => ({
  type: ADD_TODO,
  payload: text
});

export const toggleTodo = (id: string): TodoActionTypes => ({
  type: TOGGLE_TODO,
  payload: id
});
// ... 更多 actions
```

**Reducer (reducer.ts - 60 行)**
```typescript
const todoReducer = (
  state = initialState,
  action: TodoActionTypes
): TodoState => {
  switch (action.type) {
    case ADD_TODO:
      return {
        ...state,
        todos: [/* ... */]
      };
    case TOGGLE_TODO:
      return {
        ...state,
        todos: state.todos.map(/* ... */)
      };
    // ... 更多 cases
    default:
      return state;
  }
};
```

**Store (store.ts - 20 行)**
```typescript
import { createStore } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import rootReducer from './reducers';

const store = createStore(
  rootReducer,
  composeWithDevTools()
);
```

**組件使用 (40 行)**
```tsx
import { useSelector, useDispatch } from 'react-redux';
import { addTodo, toggleTodo } from './actions';

const TodoInput = () => {
  const dispatch = useDispatch();

  const handleAdd = (text: string) => {
    dispatch(addTodo(text)); // 需要 dispatch
  };
  // ...
};
```

**總計：約 200+ 行**

---

#### Zustand (約 100 行)

**Store (useTodoStore.ts - 80 行)**
```typescript
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface TodoStore {
  todos: Todo[];
  addTodo: (text: string) => void;
  toggleTodo: (id: string) => void;
  deleteTodo: (id: string) => void;
  // ... 更多方法
}

export const useTodoStore = create<TodoStore>()(
  persist(
    (set, get) => ({
      todos: [],

      addTodo: (text) => {
        set((state) => ({
          todos: [/* ... */, ...state.todos]
        }));
      },

      toggleTodo: (id) => {
        set((state) => ({
          todos: state.todos.map(/* ... */)
        }));
      },
      // ... 更多方法
    }),
    { name: 'todos' }
  )
);
```

**組件使用 (20 行)**
```tsx
import { useTodoStore } from './store/useTodoStore';

const TodoInput = () => {
  const addTodo = useTodoStore((state) => state.addTodo);

  const handleAdd = (text: string) => {
    addTodo(text); // 直接調用
  };
  // ...
};
```

**總計：約 100 行**

**代碼量減少 50%！**

---

### 核心概念對比

| 概念 | Redux | Zustand |
|------|-------|---------|
| **Store 創建** | `createStore(reducer)` | `create(() => ({ ... }))` |
| **狀態訂閱** | `useSelector(selector)` | `useStore(selector)` |
| **狀態更新** | `dispatch(action)` | 直接調用方法 |
| **類型定義** | Actions + State + ActionTypes | 單一 Store 接口 |
| **Provider** | 必須 | 不需要 |
| **中間件** | 需要手動配置 | 內置多種 middleware |
| **持久化** | 需要 redux-persist | 內置 persist |
| **DevTools** | 需要 redux-devtools-extension | 內置支持 |
| **學習曲線** | 陡峭 | 平緩 |

### 使用體驗對比

#### 1. 訂閱狀態

```tsx
// Redux
import { useSelector } from 'react-redux';
const todos = useSelector((state: RootState) => state.todos.items);

// Zustand
import { useTodoStore } from './store/useTodoStore';
const todos = useTodoStore((state) => state.todos);
```

#### 2. 更新狀態

```tsx
// Redux
import { useDispatch } from 'react-redux';
import { addTodo } from './actions';

const dispatch = useDispatch();
dispatch(addTodo('New Todo'));

// Zustand
import { useTodoStore } from './store/useTodoStore';

const addTodo = useTodoStore((state) => state.addTodo);
addTodo('New Todo');
```

#### 3. 派生狀態

```tsx
// Redux - 需要使用 reselect
import { createSelector } from 'reselect';

const selectFilteredTodos = createSelector(
  [(state) => state.todos, (state) => state.filter],
  (todos, filter) => {
    // 過濾邏輯
  }
);

const filteredTodos = useSelector(selectFilteredTodos);

// Zustand - 直接在 store 中定義
const useTodoStore = create((set, get) => ({
  todos: [],
  filter: 'all',

  getFilteredTodos: () => {
    const { todos, filter } = get();
    // 過濾邏輯
  }
}));

const filteredTodos = useTodoStore((state) => state.getFilteredTodos());
```

#### 4. 異步操作

```tsx
// Redux - 需要 redux-thunk 或 redux-saga
import { Dispatch } from 'redux';

export const fetchTodos = () => {
  return async (dispatch: Dispatch) => {
    dispatch({ type: 'FETCH_TODOS_START' });
    try {
      const data = await api.getTodos();
      dispatch({ type: 'FETCH_TODOS_SUCCESS', payload: data });
    } catch (error) {
      dispatch({ type: 'FETCH_TODOS_ERROR', payload: error });
    }
  };
};

// Zustand - 直接使用 async/await
const useTodoStore = create((set) => ({
  todos: [],
  loading: false,
  error: null,

  fetchTodos: async () => {
    set({ loading: true });
    try {
      const data = await api.getTodos();
      set({ todos: data, loading: false });
    } catch (error) {
      set({ error, loading: false });
    }
  }
}));
```

### 性能對比

#### Redux
```tsx
// 整個 state 樹訂閱，可能導致不必要的重渲染
const state = useSelector((state) => state);

// 需要手動使用 shallowEqual 優化
import { shallowEqual } from 'react-redux';
const state = useSelector((state) => state.todos, shallowEqual);
```

#### Zustand
```tsx
// 自動淺比較，只在訂閱的狀態變化時重渲染
const todos = useTodoStore((state) => state.todos);

// 訂閱多個狀態
const { todos, filter } = useTodoStore((state) => ({
  todos: state.todos,
  filter: state.filter
}));
```

### TypeScript 支持對比

#### Redux
需要定義多種類型：
```typescript
// State 類型
interface TodoState {
  todos: Todo[];
  filter: FilterType;
}

// Action 類型常量
const ADD_TODO = 'ADD_TODO';

// Action 接口
interface AddTodoAction {
  type: typeof ADD_TODO;
  payload: string;
}

// Action 聯合類型
type TodoActionTypes = AddTodoAction | ToggleTodoAction | ...;

// Thunk 類型
type ThunkAction<R, S, E, A> = ...;
```

#### Zustand
只需一個接口：
```typescript
interface TodoStore {
  todos: Todo[];
  filter: FilterType;
  addTodo: (text: string) => void;
  toggleTodo: (id: string) => void;
  // ...
}

const useTodoStore = create<TodoStore>()(/* ... */);
```

## 🚀 何時使用 Zustand？

### ✅ 適合使用 Zustand

1. **中小型應用**
   - 狀態管理需求不太複雜
   - 希望快速開發

2. **追求簡潔**
   - 不想寫大量樣板代碼
   - 團隊成員學習曲線要求低

3. **TypeScript 項目**
   - 需要良好的類型支持
   - 希望減少類型定義工作

4. **性能敏感**
   - 需要精細控制重渲染
   - 希望自動優化性能

### ❌ 不適合使用 Zustand

1. **超大型應用**
   - 需要嚴格的狀態管理規範
   - 需要時間旅行調試
   - 需要複雜的 middleware 鏈

2. **團隊規範**
   - 團隊已經熟悉 Redux
   - 現有項目使用 Redux

3. **特殊需求**
   - 需要 Redux 生態的特定工具
   - 需要與 Redux 深度集成的庫

## 📦 核心功能

- ✅ 新增待辦事項
- ✅ 標記完成/未完成
- ✅ 刪除待辦事項
- ✅ 編輯待辦事項
- ✅ 自動持久化（localStorage）
- ✅ 篩選功能（全部/進行中/已完成）
- ✅ 清除已完成項目
- ✅ 統計數據展示
- ✅ 時間戳記錄
- ✅ 響應式設計

## 🛠️ 技術棧

- **React 18** - UI 框架
- **Zustand 4** - 狀態管理
- **TypeScript 5.3+** - 類型系統
- **Vite 5** - 構建工具
- **CSS3** - 樣式

## 📂 項目結構

```
03-react-zustand/
├── src/
│   ├── components/          # React 組件
│   │   ├── TodoInput.tsx    # 輸入組件
│   │   ├── TodoList.tsx     # 列表組件
│   │   ├── TodoItem.tsx     # 項目組件
│   │   ├── TodoFilters.tsx  # 篩選器組件
│   │   └── TodoStats.tsx    # 統計組件
│   ├── store/               # Zustand Store
│   │   └── useTodoStore.ts  # Todo Store（核心狀態管理）
│   ├── types.ts             # TypeScript 類型定義
│   ├── App.tsx              # 主應用組件
│   ├── App.css              # 樣式文件
│   └── main.tsx             # 應用入口
├── index.html               # HTML 模板
├── package.json             # 項目配置
├── tsconfig.json            # TypeScript 配置
├── vite.config.ts           # Vite 配置
└── README.md                # 本文件
```

## 🚀 快速開始

### 安裝依賴

```bash
npm install
```

### 開發模式

```bash
npm run dev
```

訪問 http://localhost:3000

### 構建生產版本

```bash
npm run build
```

### 預覽生產版本

```bash
npm run preview
```

### 類型檢查

```bash
npm run type-check
```

## 💡 核心代碼解析

### 1. Store 定義

```typescript
// src/store/useTodoStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface TodoStore {
  todos: Todo[];
  addTodo: (text: string) => void;
  toggleTodo: (id: string) => void;
  // ... 更多方法
}

export const useTodoStore = create<TodoStore>()(
  persist(
    (set, get) => ({
      todos: [],

      // 添加待辦事項
      addTodo: (text) => {
        set((state) => ({
          todos: [newTodo, ...state.todos]
        }));
      },

      // 切換完成狀態
      toggleTodo: (id) => {
        set((state) => ({
          todos: state.todos.map((todo) =>
            todo.id === id
              ? { ...todo, completed: !todo.completed }
              : todo
          )
        }));
      },

      // 獲取過濾後的待辦事項（選擇器）
      getFilteredTodos: () => {
        const { todos, filter } = get();
        return todos.filter(/* ... */);
      }
    }),
    { name: 'zustand-todos' } // localStorage key
  )
);
```

### 2. 組件中使用

```typescript
// src/components/TodoInput.tsx
import { useTodoStore } from '../store/useTodoStore';

const TodoInput = () => {
  // 只訂閱需要的方法（不會因為其他狀態變化而重渲染）
  const addTodo = useTodoStore((state) => state.addTodo);

  const handleSubmit = (text: string) => {
    addTodo(text); // 直接調用，無需 dispatch
  };

  // ...
};
```

### 3. 訂閱派生狀態

```typescript
// src/components/TodoList.tsx
import { useTodoStore } from '../store/useTodoStore';

const TodoList = () => {
  // 使用 store 中的選擇器
  const filteredTodos = useTodoStore((state) => state.getFilteredTodos());

  // ...
};
```

### 4. 訂閱多個狀態

```typescript
// src/components/TodoFilters.tsx
const TodoFilters = () => {
  // 訂閱多個狀態
  const { filter, stats, setFilter } = useTodoStore((state) => ({
    filter: state.filter,
    stats: state.getStats(),
    setFilter: state.setFilter
  }));

  // ...
};
```

## 🎨 Zustand Middleware 詳解

本專案展示了所有主要的 Zustand middleware 的實際應用。

### 1. Persist（持久化）- 自動保存狀態

**作用：** 自動將狀態保存到 localStorage，頁面刷新後自動恢復。

```typescript
import { persist, createJSONStorage } from 'zustand/middleware';

const useStore = create(
  persist(
    (set) => ({
      count: 0,
      increment: () => set((state) => ({ count: state.count + 1 }))
    }),
    {
      name: 'storage-key',              // localStorage 的 key
      storage: createJSONStorage(() => localStorage), // 存儲引擎
      // 可選配置：
      // partialize: (state) => ({ count: state.count }), // 只持久化部分狀態
      // onRehydrateStorage: () => (state) => { /* 恢復後的回調 */ }
    }
  )
);
```

**使用場景：**
- 用戶偏好設置（主題、語言等）
- 購物車數據
- 表單草稿
- 用戶登錄狀態

### 2. DevTools（Redux DevTools 支持）

**作用：** 在瀏覽器的 Redux DevTools 擴展中查看和調試狀態變化。

```typescript
import { devtools } from 'zustand/middleware';

const useStore = create(
  devtools(
    (set) => ({
      count: 0,
      increment: () => set((state) => ({ count: state.count + 1 }))
    }),
    {
      name: 'MyStore',        // DevTools 中顯示的名稱
      enabled: true,          // 是否啟用（可以在生產環境禁用）
    }
  )
);
```

**功能：**
- 查看所有狀態變化歷史
- 時間旅行調試（回到之前的狀態）
- 查看每次狀態更新的 diff
- 跟踪 action 調用

**使用步驟：**
1. 安裝 Redux DevTools 瀏覽器擴展
2. 在 store 中添加 devtools middleware
3. 打開瀏覽器開發者工具的 Redux 標籤

### 3. Immer（不可變數據簡化）

**作用：** 允許你直接修改狀態，Immer 自動處理不可變性。

```typescript
import { immer } from 'zustand/middleware/immer';

const useStore = create(
  immer((set) => ({
    todos: [],

    // ❌ 傳統方式：複雜的不可變更新
    // addTodo: (text) => set((state) => ({
    //   todos: [...state.todos, newTodo]
    // })),

    // ✅ Immer 方式：直接修改
    addTodo: (text) => set((state) => {
      state.todos.push(newTodo); // 看起來在修改，實際是不可變的
    }),

    // ✅ 更複雜的例子
    toggleTodo: (id) => set((state) => {
      const todo = state.todos.find(t => t.id === id);
      if (todo) {
        todo.completed = !todo.completed; // 直接修改深層嵌套的屬性
      }
    })
  }))
);
```

**優勢對比：**

```typescript
// 不使用 Immer（Redux 風格）
set((state) => ({
  todos: state.todos.map((todo) =>
    todo.id === id
      ? { ...todo, completed: !todo.completed, updatedAt: Date.now() }
      : todo
  )
}));

// 使用 Immer（更簡潔）
set((state) => {
  const todo = state.todos.find((t) => t.id === id);
  if (todo) {
    todo.completed = !todo.completed;
    todo.updatedAt = Date.now();
  }
});
```

**適用場景：**
- 深層嵌套的狀態更新
- 複雜的數組/對象操作
- 想要更簡潔的代碼

### 4. 組合 Middleware - 正確的順序

**重要：** Middleware 的組合順序很重要！

```typescript
const useStore = create<StoreType>()(
  // 順序：devtools → persist → immer
  devtools(           // 最外層：DevTools 監控
    persist(          // 中間層：持久化
      immer(          // 最內層：Immer 簡化
        (set, get) => ({
          // 你的狀態和方法
        })
      ),
      { name: 'storage-key' }
    ),
    { name: 'StoreName' }
  )
);
```

**順序說明：**
1. **devtools** 在最外層：可以監控所有狀態變化
2. **persist** 在中間：可以持久化處理後的狀態
3. **immer** 在最內層：處理狀態更新邏輯

**錯誤示例：**
```typescript
// ❌ 錯誤：immer 在外層會導致問題
create()(
  immer(
    persist(
      devtools((set) => ({ /* ... */ }))
    )
  )
);
```

### 5. 條件性使用 Middleware

在生產環境可能想禁用某些 middleware：

```typescript
const middlewares = (f: any) => {
  let store = immer(f);

  // 只在開發環境啟用 devtools
  if (process.env.NODE_ENV === 'development') {
    store = devtools(store, { name: 'TodoStore' });
  }

  // 總是啟用 persist
  store = persist(store, { name: 'todos' });

  return store;
};

const useStore = create<StoreType>()(middlewares((set, get) => ({
  // 你的狀態
})));
```

## 🧩 Slice Pattern（切片模式）- 大型應用最佳實踐

Slice Pattern 是 Zustand 推薦的大型應用組織方式，將 store 拆分成多個小的、可管理的部分。

### 何時使用 Slice Pattern？

**✅ 適合使用：**
- 大型應用，有很多狀態和方法
- 多人協作開發
- 需要清晰的代碼組織
- 不同功能模塊之間邏輯獨立

**❌ 不需要使用：**
- 小型應用（如本 Todo 示例）
- 狀態簡單，方法較少
- 單人開發小項目

### 實現示例

本專案提供了完整的 Slice Pattern 示例：`src/store/useTodoStoreWithSlices.ts`

```typescript
// 定義 Slice 1：Todos 管理
interface TodosSlice {
  todos: Todo[];
  addTodo: (text: string) => void;
  toggleTodo: (id: string) => void;
  // ...
}

const createTodosSlice = (set, get): TodosSlice => ({
  todos: [],
  addTodo: (text) => { /* ... */ },
  toggleTodo: (id) => { /* ... */ },
});

// 定義 Slice 2：Filter 管理
interface FilterSlice {
  filter: FilterType;
  setFilter: (filter: FilterType) => void;
}

const createFilterSlice = (set, get): FilterSlice => ({
  filter: 'all',
  setFilter: (filter) => { /* ... */ },
});

// 組合所有 Slices
type TodoStore = TodosSlice & FilterSlice;

const useTodoStore = create<TodoStore>()(
  devtools(
    persist(
      immer((set, get) => ({
        ...createTodosSlice(set, get),
        ...createFilterSlice(set, get),
      })),
      { name: 'todos' }
    ),
    { name: 'TodoStore' }
  )
);
```

### Slice Pattern 優勢

1. **代碼組織清晰**
   - 每個 slice 負責特定功能
   - 易於查找和修改

2. **易於測試**
   - 可以單獨測試每個 slice
   - 減少測試複雜度

3. **協作友好**
   - 不同開發者可以負責不同 slice
   - 減少代碼衝突

4. **易於維護**
   - 新增功能只需添加新 slice
   - 修改功能只需關注對應 slice

### Slice 之間通信

```typescript
const createUISlice = (set, get) => ({
  darkMode: false,

  toggleDarkMode: () => {
    set((state) => {
      state.darkMode = !state.darkMode;
    });

    // 通過 get() 訪問其他 slice
    const filter = get().filter;
    console.log('Current filter:', filter);

    // 調用其他 slice 的方法
    get().setFilter('all');
  }
});
```

### 完整示例文件

查看 `src/store/useTodoStoreWithSlices.ts` 了解完整的 Slice Pattern 實現。

## 📚 學習資源

### 官方文檔
- [Zustand 官方文檔](https://github.com/pmndrs/zustand)
- [Zustand TypeScript 指南](https://github.com/pmndrs/zustand/blob/main/docs/guides/typescript.md)
- [Zustand Middleware 指南](https://github.com/pmndrs/zustand/blob/main/docs/guides/middleware.md)
- [Zustand Slice Pattern](https://github.com/pmndrs/zustand/blob/main/docs/guides/slices-pattern.md)

### 推薦文章
- [Why Zustand is the Best State Management Library](https://tkdodo.eu/blog/zustand-and-react-context)
- [Zustand vs Redux: A Comparison](https://blog.logrocket.com/zustand-vs-redux/)
- [Mastering Zustand](https://tkdodo.eu/blog/working-with-zustand)

## 🎯 最佳實踐

### 1. 組織 Store

```typescript
// ✅ 好的做法：按功能拆分
const useTodoStore = create(/* ... */);
const useUserStore = create(/* ... */);
const useUIStore = create(/* ... */);

// ❌ 不好的做法：所有狀態放在一個 store
const useAppStore = create(/* ... */);
```

### 2. 選擇性訂閱

```typescript
// ✅ 好的做法：只訂閱需要的狀態
const todos = useTodoStore((state) => state.todos);
const addTodo = useTodoStore((state) => state.addTodo);

// ❌ 不好的做法：訂閱整個 store
const store = useTodoStore();
```

### 3. 使用選擇器

```typescript
// ✅ 好的做法：在 store 中定義選擇器
const useTodoStore = create((set, get) => ({
  todos: [],
  filter: 'all',

  getFilteredTodos: () => {
    const { todos, filter } = get();
    return todos.filter(/* ... */);
  }
}));

// 組件中使用
const filtered = useTodoStore((state) => state.getFilteredTodos());

// ❌ 不好的做法：在組件中過濾
const todos = useTodoStore((state) => state.todos);
const filter = useTodoStore((state) => state.filter);
const filtered = todos.filter(/* ... */); // 每次渲染都計算
```

### 4. 異步操作

```typescript
// ✅ 好的做法：在 store 中處理異步
const useStore = create((set) => ({
  data: null,
  loading: false,

  fetchData: async () => {
    set({ loading: true });
    try {
      const data = await api.fetch();
      set({ data, loading: false });
    } catch (error) {
      set({ error, loading: false });
    }
  }
}));

// 組件中使用
const fetchData = useStore((state) => state.fetchData);
useEffect(() => { fetchData(); }, []);
```

## 🔍 常見問題

### Q: Zustand 和 Context API 的區別？

**A:**
- **Context API**：狀態變化時，所有訂閱的組件都會重渲染
- **Zustand**：只有訂閱了變化狀態的組件才會重渲染

### Q: Zustand 需要 Provider 嗎？

**A:** 不需要！這是 Zustand 的一大優勢。

### Q: Zustand 支持 Redux DevTools 嗎？

**A:** 支持！使用 `devtools` middleware。

### Q: Zustand 如何持久化？

**A:** 使用內置的 `persist` middleware。

### Q: Zustand 適合大型應用嗎？

**A:** 適合中小型應用。超大型應用可能需要 Redux 的嚴格規範。

## 📈 性能優化

### 1. 選擇性訂閱

```typescript
// ✅ 只訂閱需要的狀態
const count = useStore((state) => state.count);

// ❌ 訂閱整個 store
const store = useStore();
```

### 2. 使用淺比較

```typescript
import { shallow } from 'zustand/shallow';

// 訂閱多個狀態時使用 shallow
const { todos, filter } = useStore(
  (state) => ({ todos: state.todos, filter: state.filter }),
  shallow
);
```

### 3. 使用選擇器避免重複計算

```typescript
// ✅ 在 store 中定義選擇器
const getExpensiveData = () => {
  const data = get().data;
  return expensiveOperation(data);
};

// ❌ 在組件中計算
const Component = () => {
  const data = useStore((state) => state.data);
  const result = expensiveOperation(data); // 每次渲染都計算
};
```

## 🎉 總結

Zustand 是一個**極簡、高效、TypeScript 友好**的狀態管理庫，相比 Redux：

- ✅ **代碼量減少 50-80%**
- ✅ **學習曲線平緩**
- ✅ **性能更優**
- ✅ **無需 Provider**
- ✅ **TypeScript 支持更好**

對於**中小型項目**，Zustand 是比 Redux 更好的選擇！

---

## 📝 授權

MIT License
