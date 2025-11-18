# React + MobX Todo List

響應式狀態管理 - 使用 MobX 構建的待辦事項應用

## 🎯 專案概述

這是一個使用 **React 18** + **MobX 6** + **TypeScript** 構建的 Todo List 應用，展示了 MobX 作為響應式狀態管理庫的核心優勢和強大功能。

## 🌟 MobX 特色

### 1. **響應式編程（Reactive Programming）**
- 自動追蹤依賴關係
- 狀態變化自動更新 UI
- 類似 Vue 的響應式系統

### 2. **直觀的 API**
```typescript
// 簡單、直觀的狀態修改
store.addTodo('New Todo'); // 直接調用方法

// 自動計算派生狀態
get filteredTodos() {
  return this.todos.filter(/* ... */);
}
```

### 3. **最小化樣板代碼**
- 無需 actions types
- 無需 reducers
- 無需 dispatch
- 使用 makeAutoObservable 自動處理

### 4. **TypeScript 原生支持**
- 完整的類型推斷
- 無需複雜的類型體操
- Class-based 或 Function-based 都支持

### 5. **高性能**
- 細粒度更新，只重渲染必要的組件
- 自動批量更新
- Computed values 自動緩存

### 6. **無需 Provider**
```tsx
// ❌ Redux/Context 需要
<Provider store={store}>
  <App />
</Provider>

// ✅ MobX 直接使用
<App />
```

## 📊 MobX 核心概念

### 1. Observable State（可觀察狀態）

Observable state 是應用的核心數據，任何變化都會自動通知依賴的觀察者。

#### 創建 Observable

```typescript
import { makeObservable, observable } from 'mobx';

class TodoStore {
  todos: Todo[] = [];
  filter: FilterType = 'all';

  constructor() {
    makeObservable(this, {
      todos: observable,
      filter: observable,
    });
  }
}
```

#### 使用 makeAutoObservable（推薦）

```typescript
import { makeAutoObservable } from 'mobx';

class TodoStore {
  todos: Todo[] = [];
  filter: FilterType = 'all';

  constructor() {
    // 自動將所有屬性轉換為 observable
    // 所有方法轉換為 action
    // 所有 getter 轉換為 computed
    makeAutoObservable(this);
  }
}
```

#### Observable 深度

```typescript
class Store {
  // 深度 observable - 嵌套對象也是 observable
  user = {
    profile: {
      name: 'John',
      age: 30,
    },
  };

  constructor() {
    makeAutoObservable(this);
  }

  updateAge(age: number) {
    // MobX 會追蹤到深層變化
    this.user.profile.age = age;
  }
}
```

### 2. Actions（動作）

Actions 是修改 observable state 的方法，確保狀態變化可追蹤和可預測。

#### 定義 Actions

```typescript
class TodoStore {
  todos: Todo[] = [];

  constructor() {
    makeAutoObservable(this);
  }

  // Action - 添加 todo
  addTodo(text: string) {
    this.todos.push({
      id: Date.now().toString(),
      text,
      completed: false,
    });
  }

  // Action - 切換完成狀態
  toggleTodo(id: string) {
    const todo = this.todos.find(t => t.id === id);
    if (todo) {
      todo.completed = !todo.completed;
    }
  }
}
```

#### 異步 Actions

```typescript
class TodoStore {
  todos: Todo[] = [];
  loading = false;
  error: string | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  // 異步 action
  async fetchTodos() {
    this.loading = true;
    try {
      const response = await fetch('/api/todos');
      const data = await response.json();
      // 直接修改 state
      this.todos = data;
      this.error = null;
    } catch (error) {
      this.error = error.message;
    } finally {
      this.loading = false;
    }
  }
}
```

#### Action 裝飾器（需要啟用 experimentalDecorators）

```typescript
import { makeObservable, observable, action } from 'mobx';

class TodoStore {
  @observable todos: Todo[] = [];
  @observable filter: FilterType = 'all';

  constructor() {
    makeObservable(this);
  }

  @action
  addTodo(text: string) {
    this.todos.push({ /* ... */ });
  }

  @action
  setFilter(filter: FilterType) {
    this.filter = filter;
  }
}
```

### 3. Computed Values（計算值）

Computed values 是從 observable state 派生的值，會自動緩存，只有當依賴變化時才重新計算。

#### 定義 Computed Values

```typescript
class TodoStore {
  todos: Todo[] = [];
  filter: FilterType = 'all';

  constructor() {
    makeAutoObservable(this);
  }

  // Computed value - 自動緩存
  get filteredTodos(): Todo[] {
    switch (this.filter) {
      case 'active':
        return this.todos.filter(t => !t.completed);
      case 'completed':
        return this.todos.filter(t => t.completed);
      default:
        return this.todos;
    }
  }

  // Computed value - 統計數據
  get stats() {
    return {
      total: this.todos.length,
      active: this.todos.filter(t => !t.completed).length,
      completed: this.todos.filter(t => t.completed).length,
    };
  }

  // Computed value - 派生自其他 computed
  get completionRate() {
    if (this.stats.total === 0) return 0;
    return (this.stats.completed / this.stats.total) * 100;
  }
}
```

#### Computed 性能優勢

```typescript
class PerformanceStore {
  numbers: number[] = [1, 2, 3, 4, 5];

  constructor() {
    makeAutoObservable(this);
  }

  // ✅ Computed - 只在 numbers 變化時計算一次
  get sum() {
    console.log('Computing sum...');
    return this.numbers.reduce((a, b) => a + b, 0);
  }

  // ❌ 普通方法 - 每次訪問都計算
  getSum() {
    console.log('Computing sum...');
    return this.numbers.reduce((a, b) => a + b, 0);
  }
}

const store = new PerformanceStore();

// Computed 只計算一次
console.log(store.sum); // Computing sum... 15
console.log(store.sum); // 15 (使用緩存)
console.log(store.sum); // 15 (使用緩存)

// 普通方法每次都計算
console.log(store.getSum()); // Computing sum... 15
console.log(store.getSum()); // Computing sum... 15
console.log(store.getSum()); // Computing sum... 15
```

### 4. Reactions（反應）

Reactions 是當 observable state 變化時自動執行的副作用。

#### autorun - 自動運行

```typescript
import { autorun } from 'mobx';

const store = new TodoStore();

// 自動追蹤依賴，當 todos 變化時自動執行
autorun(() => {
  console.log('Total todos:', store.todos.length);
});

store.addTodo('New Todo'); // 自動觸發 autorun
```

#### reaction - 響應特定變化

```typescript
import { reaction } from 'mobx';

const store = new TodoStore();

// 只在 filter 變化時執行
reaction(
  () => store.filter,
  (filter) => {
    console.log('Filter changed to:', filter);
  }
);

store.setFilter('active'); // 觸發 reaction
store.addTodo('New Todo'); // 不觸發（todos 變化不影響 filter）
```

#### when - 條件執行

```typescript
import { when } from 'mobx';

const store = new TodoStore();

// 當所有 todos 完成時執行一次
when(
  () => store.todos.length > 0 && store.todos.every(t => t.completed),
  () => {
    console.log('All todos completed! 🎉');
  }
);
```

#### 實際應用：自動持久化

```typescript
class TodoStore {
  todos: Todo[] = [];

  constructor() {
    makeAutoObservable(this);
    this.loadFromStorage();
    this.setupAutoPersist();
  }

  private loadFromStorage() {
    const stored = localStorage.getItem('todos');
    if (stored) {
      this.todos = JSON.parse(stored);
    }
  }

  private setupAutoPersist() {
    // 當 todos 變化時自動保存到 localStorage
    reaction(
      () => this.todos,
      (todos) => {
        localStorage.setItem('todos', JSON.stringify(todos));
      }
    );
  }
}
```

## 🔄 MobX vs Redux vs Zustand 詳細對比

### 代碼量對比

#### Redux (約 250+ 行)

**Types (types.ts - 40 行)**
```typescript
// Action Types
export const ADD_TODO = 'ADD_TODO';
export const TOGGLE_TODO = 'TOGGLE_TODO';
export const DELETE_TODO = 'DELETE_TODO';
export const SET_FILTER = 'SET_FILTER';

// State Interface
export interface TodoState {
  todos: Todo[];
  filter: FilterType;
}

// Action Interfaces
interface AddTodoAction {
  type: typeof ADD_TODO;
  payload: string;
}

interface ToggleTodoAction {
  type: typeof TOGGLE_TODO;
  payload: string;
}

interface DeleteTodoAction {
  type: typeof DELETE_TODO;
  payload: string;
}

interface SetFilterAction {
  type: typeof SET_FILTER;
  payload: FilterType;
}

export type TodoActionTypes =
  | AddTodoAction
  | ToggleTodoAction
  | DeleteTodoAction
  | SetFilterAction;
```

**Actions (actions.ts - 50 行)**
```typescript
export const addTodo = (text: string): TodoActionTypes => ({
  type: ADD_TODO,
  payload: text,
});

export const toggleTodo = (id: string): TodoActionTypes => ({
  type: TOGGLE_TODO,
  payload: id,
});

export const deleteTodo = (id: string): TodoActionTypes => ({
  type: DELETE_TODO,
  payload: id,
});

export const setFilter = (filter: FilterType): TodoActionTypes => ({
  type: SET_FILTER,
  payload: filter,
});
```

**Reducer (reducer.ts - 80 行)**
```typescript
const initialState: TodoState = {
  todos: [],
  filter: 'all',
};

const todoReducer = (
  state = initialState,
  action: TodoActionTypes
): TodoState => {
  switch (action.type) {
    case ADD_TODO:
      return {
        ...state,
        todos: [
          {
            id: Date.now().toString(),
            text: action.payload,
            completed: false,
          },
          ...state.todos,
        ],
      };

    case TOGGLE_TODO:
      return {
        ...state,
        todos: state.todos.map((todo) =>
          todo.id === action.payload
            ? { ...todo, completed: !todo.completed }
            : todo
        ),
      };

    case DELETE_TODO:
      return {
        ...state,
        todos: state.todos.filter((todo) => todo.id !== action.payload),
      };

    case SET_FILTER:
      return {
        ...state,
        filter: action.payload,
      };

    default:
      return state;
  }
};

export default todoReducer;
```

**Selectors (selectors.ts - 30 行)**
```typescript
import { createSelector } from 'reselect';

export const selectTodos = (state: RootState) => state.todos.todos;
export const selectFilter = (state: RootState) => state.todos.filter;

export const selectFilteredTodos = createSelector(
  [selectTodos, selectFilter],
  (todos, filter) => {
    switch (filter) {
      case 'active':
        return todos.filter((t) => !t.completed);
      case 'completed':
        return todos.filter((t) => t.completed);
      default:
        return todos;
    }
  }
);
```

**Store (store.ts - 30 行)**
```typescript
import { createStore } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import rootReducer from './reducers';

const store = createStore(rootReducer, composeWithDevTools());

export default store;
```

**組件使用 (50 行)**
```tsx
import { useSelector, useDispatch } from 'react-redux';
import { addTodo, toggleTodo } from './actions';
import { selectFilteredTodos } from './selectors';

const TodoInput = () => {
  const dispatch = useDispatch();

  const handleAdd = (text: string) => {
    dispatch(addTodo(text)); // 需要 dispatch
  };

  // ...
};

const TodoList = () => {
  const filteredTodos = useSelector(selectFilteredTodos);
  // ...
};
```

**總計：約 280+ 行**

---

#### Zustand (約 100 行)

**Store (useTodoStore.ts - 80 行)**
```typescript
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface TodoStore {
  todos: Todo[];
  filter: FilterType;
  addTodo: (text: string) => void;
  toggleTodo: (id: string) => void;
  deleteTodo: (id: string) => void;
  setFilter: (filter: FilterType) => void;
  getFilteredTodos: () => Todo[];
}

export const useTodoStore = create<TodoStore>()(
  persist(
    (set, get) => ({
      todos: [],
      filter: 'all',

      addTodo: (text) => {
        set((state) => ({
          todos: [
            {
              id: Date.now().toString(),
              text,
              completed: false,
            },
            ...state.todos,
          ],
        }));
      },

      toggleTodo: (id) => {
        set((state) => ({
          todos: state.todos.map((todo) =>
            todo.id === id
              ? { ...todo, completed: !todo.completed }
              : todo
          ),
        }));
      },

      deleteTodo: (id) => {
        set((state) => ({
          todos: state.todos.filter((t) => t.id !== id),
        }));
      },

      setFilter: (filter) => {
        set({ filter });
      },

      getFilteredTodos: () => {
        const { todos, filter } = get();
        switch (filter) {
          case 'active':
            return todos.filter((t) => !t.completed);
          case 'completed':
            return todos.filter((t) => t.completed);
          default:
            return todos;
        }
      },
    }),
    { name: 'zustand-todos' }
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

const TodoList = () => {
  const filteredTodos = useTodoStore((state) => state.getFilteredTodos());
  // ...
};
```

**總計：約 100 行**

---

#### MobX (約 80 行)

**Store (TodoStore.ts - 70 行)**
```typescript
import { makeAutoObservable, reaction } from 'mobx';

class TodoStore {
  todos: Todo[] = [];
  filter: FilterType = 'all';

  constructor() {
    makeAutoObservable(this);
    this.loadFromStorage();
    this.setupAutoPersist();
  }

  // Actions
  addTodo(text: string) {
    this.todos.unshift({
      id: Date.now().toString(),
      text,
      completed: false,
    });
  }

  toggleTodo(id: string) {
    const todo = this.todos.find((t) => t.id === id);
    if (todo) {
      todo.completed = !todo.completed;
    }
  }

  deleteTodo(id: string) {
    this.todos = this.todos.filter((t) => t.id !== id);
  }

  setFilter(filter: FilterType) {
    this.filter = filter;
  }

  // Computed
  get filteredTodos(): Todo[] {
    switch (this.filter) {
      case 'active':
        return this.todos.filter((t) => !t.completed);
      case 'completed':
        return this.todos.filter((t) => t.completed);
      default:
        return this.todos;
    }
  }

  private loadFromStorage() {
    const stored = localStorage.getItem('mobx-todos');
    if (stored) this.todos = JSON.parse(stored);
  }

  private setupAutoPersist() {
    reaction(
      () => this.todos,
      (todos) => localStorage.setItem('mobx-todos', JSON.stringify(todos))
    );
  }
}

export const todoStore = new TodoStore();
```

**組件使用 (10 行)**
```tsx
import { observer } from 'mobx-react-lite';
import { todoStore } from './stores/TodoStore';

const TodoInput = observer(() => {
  const handleAdd = (text: string) => {
    todoStore.addTodo(text); // 直接調用
  };

  // ...
});

const TodoList = observer(() => {
  const { filteredTodos } = todoStore;
  // ...
});
```

**總計：約 80 行**

**代碼量減少 70%！**（相比 Redux）

---

### 核心概念對比表

| 概念 | Redux | Zustand | MobX |
|------|-------|---------|------|
| **Store 創建** | `createStore(reducer)` | `create(() => ({ ... }))` | `new Store()` + `makeAutoObservable()` |
| **狀態訂閱** | `useSelector(selector)` | `useStore(selector)` | `observer(Component)` |
| **狀態更新** | `dispatch(action)` | 直接調用方法 | 直接修改狀態 |
| **類型定義** | Actions + State + ActionTypes | 單一 Store 接口 | Class 屬性 |
| **Provider** | 必須 | 不需要 | 不需要 |
| **派生狀態** | Selectors (reselect) | 函數或 computed | Computed values (自動緩存) |
| **異步操作** | Thunks/Saga | async/await | async/await |
| **中間件** | 手動配置 | 內置 middleware | Reactions |
| **持久化** | redux-persist | persist middleware | reaction + localStorage |
| **DevTools** | Redux DevTools | 內置支持 | MobX DevTools |
| **學習曲線** | 陡峭 | 平緩 | 中等 |
| **樣板代碼** | 多 | 少 | 最少 |
| **響應式** | ❌ | ❌ | ✅ |

### 詳細使用體驗對比

#### 1. 狀態更新方式

```tsx
// Redux - 需要 dispatch action
import { useDispatch } from 'react-redux';
import { addTodo } from './actions';

const dispatch = useDispatch();
dispatch(addTodo('New Todo'));

// Zustand - 直接調用方法
import { useTodoStore } from './store';

const addTodo = useTodoStore((state) => state.addTodo);
addTodo('New Todo');

// MobX - 最簡單，直接修改
import { todoStore } from './stores/TodoStore';

todoStore.addTodo('New Todo');
```

#### 2. 派生狀態處理

```tsx
// Redux - 需要 selectors
import { createSelector } from 'reselect';

const selectFilteredTodos = createSelector(
  [(state) => state.todos, (state) => state.filter],
  (todos, filter) => {
    return todos.filter(/* ... */);
  }
);

const filteredTodos = useSelector(selectFilteredTodos);

// Zustand - 在 store 中定義函數
const getFilteredTodos = useTodoStore((state) => state.getFilteredTodos());

// MobX - Computed values（自動緩存）
class TodoStore {
  get filteredTodos() {
    return this.todos.filter(/* ... */);
  }
}

const { filteredTodos } = todoStore; // 自動緩存
```

#### 3. 異步操作

```tsx
// Redux - 需要 thunk middleware
export const fetchTodos = () => {
  return async (dispatch: Dispatch) => {
    dispatch({ type: 'FETCH_START' });
    try {
      const data = await api.getTodos();
      dispatch({ type: 'FETCH_SUCCESS', payload: data });
    } catch (error) {
      dispatch({ type: 'FETCH_ERROR', payload: error });
    }
  };
};

// Zustand - 直接 async/await
const useTodoStore = create((set) => ({
  fetchTodos: async () => {
    set({ loading: true });
    try {
      const data = await api.getTodos();
      set({ todos: data, loading: false });
    } catch (error) {
      set({ error, loading: false });
    }
  },
}));

// MobX - 最簡潔
class TodoStore {
  loading = false;

  async fetchTodos() {
    this.loading = true;
    try {
      const data = await api.getTodos();
      this.todos = data;
    } finally {
      this.loading = false;
    }
  }
}
```

#### 4. 組件訂閱

```tsx
// Redux - useSelector
const TodoList = () => {
  const todos = useSelector((state) => state.todos);
  const filter = useSelector((state) => state.filter);
  // ...
};

// Zustand - 選擇器函數
const TodoList = () => {
  const { todos, filter } = useTodoStore((state) => ({
    todos: state.todos,
    filter: state.filter,
  }));
  // ...
};

// MobX - observer HOC（最簡單）
const TodoList = observer(() => {
  const { todos, filter } = todoStore;
  // 自動追蹤依賴，自動重渲染
});
```

## 🏗️ Class-based vs Function-based Stores

### Class-based Store（推薦用於複雜邏輯）

```typescript
import { makeAutoObservable } from 'mobx';

class TodoStore {
  todos: Todo[] = [];
  filter: FilterType = 'all';

  constructor() {
    makeAutoObservable(this);
  }

  // 方法組織清晰
  addTodo(text: string) {
    this.todos.push({ /* ... */ });
  }

  deleteTodo(id: string) {
    this.todos = this.todos.filter(t => t.id !== id);
  }

  // Computed values
  get filteredTodos() {
    return this.todos.filter(/* ... */);
  }

  get stats() {
    return {
      total: this.todos.length,
      active: this.activeTodos.length,
    };
  }

  // Private 方法
  private loadFromStorage() {
    // ...
  }
}

export const todoStore = new TodoStore();
```

**優點：**
- ✅ OOP 風格，組織清晰
- ✅ 支持繼承和私有方法
- ✅ 適合複雜業務邏輯
- ✅ TypeScript 類型推斷完美

**缺點：**
- ❌ 需要理解 Class 語法
- ❌ this 綁定問題

---

### Function-based Store（推薦用於簡單邏輯）

```typescript
import { makeAutoObservable } from 'mobx';

function createTodoStore() {
  const store = {
    todos: [] as Todo[],
    filter: 'all' as FilterType,

    addTodo(text: string) {
      this.todos.push({ /* ... */ });
    },

    deleteTodo(id: string) {
      this.todos = this.todos.filter(t => t.id !== id);
    },

    get filteredTodos() {
      return this.todos.filter(/* ... */);
    },
  };

  makeAutoObservable(store);
  return store;
}

export const todoStore = createTodoStore();
```

**優點：**
- ✅ 函數式風格
- ✅ 無需 Class 語法
- ✅ 適合簡單邏輯

**缺點：**
- ❌ 無法使用私有方法
- ❌ 無法繼承
- ❌ this 仍需注意

---

### 使用裝飾器（需要 experimentalDecorators）

```typescript
import { makeObservable, observable, action, computed } from 'mobx';

class TodoStore {
  @observable todos: Todo[] = [];
  @observable filter: FilterType = 'all';

  constructor() {
    makeObservable(this);
  }

  @action
  addTodo(text: string) {
    this.todos.push({ /* ... */ });
  }

  @action
  setFilter(filter: FilterType) {
    this.filter = filter;
  }

  @computed
  get filteredTodos() {
    return this.todos.filter(/* ... */);
  }
}
```

**優點：**
- ✅ 語義清晰
- ✅ 類似 Angular/NestJS

**缺點：**
- ❌ 需要配置 experimentalDecorators
- ❌ TypeScript 5+ 裝飾器語法變化

---

### 多 Store 組織

```typescript
// stores/TodoStore.ts
class TodoStore {
  todos: Todo[] = [];
  // ...
}

export const todoStore = new TodoStore();

// stores/UserStore.ts
class UserStore {
  user: User | null = null;
  // ...
}

export const userStore = new UserStore();

// stores/RootStore.ts（組合多個 store）
class RootStore {
  todoStore: TodoStore;
  userStore: UserStore;

  constructor() {
    this.todoStore = new TodoStore();
    this.userStore = new UserStore();
    makeAutoObservable(this);
  }
}

export const rootStore = new RootStore();

// 組件中使用
const App = observer(() => {
  const { todoStore, userStore } = rootStore;
  // ...
});
```

## ⚡ 性能優勢

### 1. 細粒度更新

```typescript
class Store {
  name = 'John';
  age = 30;

  constructor() {
    makeAutoObservable(this);
  }
}

const store = new Store();

// Component A - 只訂閱 name
const ComponentA = observer(() => {
  return <div>{store.name}</div>;
  // 只在 name 變化時重渲染
});

// Component B - 只訂閱 age
const ComponentB = observer(() => {
  return <div>{store.age}</div>;
  // 只在 age 變化時重渲染
});

// 修改 age 不會影響 Component A
store.age = 31; // 只有 Component B 重渲染
```

### 2. Computed Values 自動緩存

```typescript
class TodoStore {
  todos: Todo[] = [];

  constructor() {
    makeAutoObservable(this);
  }

  // ✅ Computed - 自動緩存
  get expensiveComputation() {
    console.log('Computing...');
    return this.todos.map(/* 複雜計算 */);
  }
}

const store = new TodoStore();

// 多次訪問只計算一次
const Component = observer(() => {
  const result1 = store.expensiveComputation; // Computing...
  const result2 = store.expensiveComputation; // 使用緩存
  const result3 = store.expensiveComputation; // 使用緩存
  // ...
});
```

### 3. 自動批量更新

```typescript
class TodoStore {
  todos: Todo[] = [];
  filter: FilterType = 'all';

  constructor() {
    makeAutoObservable(this);
  }

  updateMultiple() {
    // MobX 自動批量更新，只觸發一次重渲染
    this.todos.push({ /* ... */ });
    this.todos.push({ /* ... */ });
    this.filter = 'active';
    this.todos[0].completed = true;
  }
}

const Component = observer(() => {
  // updateMultiple 執行後只重渲染一次
  return <div>{/* ... */}</div>;
});
```

### 4. 性能對比測試

```typescript
// 測試場景：10,000 個 todos，頻繁更新

// Redux
// - 每次更新需要創建新對象
// - 深拷貝開銷大
// - Selector 計算開銷

// Zustand
// - 比 Redux 快，但仍需創建新對象
// - 無深拷貝

// MobX
// - 直接修改，無需創建新對象
// - Computed 自動緩存
// - 細粒度更新
// - 性能最優！
```

## 🚀 何時使用 MobX？

### ✅ 適合使用 MobX

#### 1. **複雜的業務邏輯**
```typescript
class OrderStore {
  orders: Order[] = [];
  selectedOrder: Order | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  // 複雜的業務邏輯
  get totalRevenue() {
    return this.orders.reduce((sum, order) => sum + order.total, 0);
  }

  get monthlyRevenue() {
    const now = new Date();
    return this.orders
      .filter(o => isSameMonth(o.createdAt, now))
      .reduce((sum, order) => sum + order.total, 0);
  }

  get topCustomers() {
    // 複雜的數據分析
    // MobX computed 自動緩存
  }
}
```

#### 2. **大量派生狀態**
```typescript
class DashboardStore {
  users: User[] = [];
  orders: Order[] = [];
  products: Product[] = [];

  constructor() {
    makeAutoObservable(this);
  }

  // 大量 computed values
  get activeUsers() { /* ... */ }
  get premiumUsers() { /* ... */ }
  get userGrowthRate() { /* ... */ }
  get orderStats() { /* ... */ }
  get productStats() { /* ... */ }
  get revenueByCategory() { /* ... */ }
  // ... 更多派生狀態
}
```

#### 3. **需要響應式編程**
```typescript
class FormStore {
  fields = {
    email: '',
    password: '',
    confirmPassword: '',
  };

  constructor() {
    makeAutoObservable(this);
  }

  // 響應式驗證
  get emailValid() {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.fields.email);
  }

  get passwordValid() {
    return this.fields.password.length >= 8;
  }

  get confirmPasswordValid() {
    return this.fields.password === this.fields.confirmPassword;
  }

  get formValid() {
    return this.emailValid && this.passwordValid && this.confirmPasswordValid;
  }
}

// UI 自動響應驗證結果
const Form = observer(() => {
  const { fields, formValid } = formStore;
  return (
    <form>
      <input
        value={fields.email}
        onChange={(e) => (formStore.fields.email = e.target.value)}
      />
      {!formStore.emailValid && <Error>Invalid email</Error>}
      <button disabled={!formValid}>Submit</button>
    </form>
  );
});
```

#### 4. **Vue 用戶轉 React**
- 熟悉響應式系統
- 習慣直接修改狀態
- MobX 提供類似 Vue 的開發體驗

#### 5. **不想寫大量樣板代碼**
- Redux 樣板代碼太多
- 追求開發效率
- 團隊規模較小

### ❌ 不適合使用 MobX

#### 1. **超大型應用（100+ 開發者）**
- 需要嚴格的狀態管理規範
- 需要強制的單向數據流
- Redux 更適合

#### 2. **需要時間旅行調試**
- MobX 不支持時間旅行
- Redux DevTools 功能更強大

#### 3. **團隊偏好函數式編程**
- MobX 是面向對象的
- Redux 更函數式

#### 4. **需要深度集成 Redux 生態**
- Redux middleware 豐富
- Redux 工具鏈成熟

## 📦 核心功能

- ✅ 新增待辦事項
- ✅ 標記完成/未完成
- ✅ 刪除待辦事項
- ✅ 編輯待辦事項
- ✅ 自動持久化（使用 Reactions）
- ✅ 篩選功能（全部/進行中/已完成）
- ✅ 清除已完成項目
- ✅ 統計數據展示（使用 Computed Values）
- ✅ 時間戳記錄
- ✅ 響應式設計

## 🛠️ 技術棧

- **React 18** - UI 框架
- **MobX 6** - 響應式狀態管理
- **mobx-react-lite** - React 綁定（使用 Hooks）
- **TypeScript 5.3+** - 類型系統
- **Vite 5** - 構建工具
- **CSS3** - 樣式

## 📂 項目結構

```
04-react-mobx/
├── src/
│   ├── components/          # React 組件
│   │   ├── TodoInput.tsx    # 輸入組件
│   │   ├── TodoList.tsx     # 列表組件
│   │   ├── TodoItem.tsx     # 項目組件
│   │   ├── TodoFilters.tsx  # 篩選器組件
│   │   └── TodoStats.tsx    # 統計組件
│   ├── stores/              # MobX Stores
│   │   └── TodoStore.ts     # Todo Store（核心狀態管理）
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

## 💡 核心代碼解析

### 1. Store 定義

```typescript
// src/stores/TodoStore.ts
import { makeAutoObservable, reaction } from 'mobx';

class TodoStore {
  // Observable State
  todos: Todo[] = [];
  filter: FilterType = 'all';

  constructor() {
    // 自動處理 observable/action/computed
    makeAutoObservable(this);

    // 加載數據
    this.loadFromStorage();

    // 設置自動保存
    reaction(
      () => this.todos,
      (todos) => {
        localStorage.setItem('mobx-todos', JSON.stringify(todos));
      }
    );
  }

  // Actions
  addTodo(text: string) {
    this.todos.unshift({
      id: Date.now().toString(),
      text: text.trim(),
      completed: false,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
  }

  toggleTodo(id: string) {
    const todo = this.todos.find((t) => t.id === id);
    if (todo) {
      todo.completed = !todo.completed;
      todo.updatedAt = Date.now();
    }
  }

  // Computed Values
  get filteredTodos(): Todo[] {
    switch (this.filter) {
      case 'active':
        return this.todos.filter((t) => !t.completed);
      case 'completed':
        return this.todos.filter((t) => t.completed);
      default:
        return this.todos;
    }
  }

  get stats() {
    return {
      total: this.todos.length,
      active: this.todos.filter((t) => !t.completed).length,
      completed: this.todos.filter((t) => t.completed).length,
    };
  }

  private loadFromStorage() {
    const stored = localStorage.getItem('mobx-todos');
    if (stored) {
      this.todos = JSON.parse(stored);
    }
  }
}

export const todoStore = new TodoStore();
```

### 2. 組件中使用

```typescript
// src/components/TodoInput.tsx
import { observer } from 'mobx-react-lite';
import { todoStore } from '../stores/TodoStore';

const TodoInput = observer(() => {
  const [text, setText] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (text.trim()) {
      todoStore.addTodo(text); // 直接調用
      setText('');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <button type="submit">新增</button>
    </form>
  );
});
```

### 3. 使用 Computed Values

```typescript
// src/components/TodoList.tsx
import { observer } from 'mobx-react-lite';
import { todoStore } from '../stores/TodoStore';

const TodoList = observer(() => {
  // 使用 computed value，自動緩存
  const { filteredTodos } = todoStore;

  return (
    <ul>
      {filteredTodos.map((todo) => (
        <TodoItem key={todo.id} todo={todo} />
      ))}
    </ul>
  );
});
```

### 4. 響應式更新

```typescript
// src/components/TodoStats.tsx
import { observer } from 'mobx-react-lite';
import { todoStore } from '../stores/TodoStore';

const TodoStats = observer(() => {
  // 自動追蹤依賴，stats 變化時自動重渲染
  const { stats } = todoStore;

  return (
    <div>
      <div>總計: {stats.total}</div>
      <div>進行中: {stats.active}</div>
      <div>已完成: {stats.completed}</div>
    </div>
  );
});
```

## 🎨 MobX 進階技巧

### 1. runInAction - 處理異步

```typescript
import { runInAction } from 'mobx';

class TodoStore {
  todos: Todo[] = [];
  loading = false;

  constructor() {
    makeAutoObservable(this);
  }

  async fetchTodos() {
    this.loading = true;

    try {
      const response = await fetch('/api/todos');
      const data = await response.json();

      // 在 runInAction 中修改狀態
      runInAction(() => {
        this.todos = data;
        this.loading = false;
      });
    } catch (error) {
      runInAction(() => {
        this.loading = false;
      });
    }
  }
}
```

### 2. flow - 處理異步（推薦）

```typescript
import { flow, makeAutoObservable } from 'mobx';

class TodoStore {
  todos: Todo[] = [];
  loading = false;

  constructor() {
    makeAutoObservable(this, {
      fetchTodos: flow, // 標記為 flow
    });
  }

  // 使用 generator 語法
  *fetchTodos() {
    this.loading = true;

    try {
      const response = yield fetch('/api/todos');
      const data = yield response.json();

      // 直接修改，自動包裝在 action 中
      this.todos = data;
      this.loading = false;
    } catch (error) {
      this.loading = false;
    }
  }
}

// 使用
todoStore.fetchTodos();
```

### 3. Reactions 進階用法

```typescript
import { autorun, reaction, when } from 'mobx';

class TodoStore {
  constructor() {
    makeAutoObservable(this);

    // autorun - 立即執行，自動追蹤依賴
    autorun(() => {
      console.log('Todos:', this.todos.length);
    });

    // reaction - 只在依賴變化時執行
    reaction(
      () => this.filter,
      (filter) => {
        console.log('Filter changed:', filter);
      }
    );

    // when - 條件滿足時執行一次
    when(
      () => this.todos.length >= 10,
      () => {
        console.log('You have 10 todos!');
      }
    );
  }
}
```

### 4. 攔截器（Interceptors）

```typescript
import { makeAutoObservable, intercept } from 'mobx';

class TodoStore {
  todos: Todo[] = [];

  constructor() {
    makeAutoObservable(this);

    // 攔截 todos 的變化
    intercept(this, 'todos', (change) => {
      console.log('Intercepting change:', change);

      // 可以修改或取消變化
      if (change.newValue.length > 100) {
        console.warn('Too many todos!');
        return null; // 取消變化
      }

      return change; // 允許變化
    });
  }
}
```

## 📚 學習資源

### 官方文檔
- [MobX 官方文檔](https://mobx.js.org/)
- [MobX React 集成](https://mobx.js.org/react-integration.html)
- [MobX 最佳實踐](https://mobx.js.org/best-practices.html)

### 推薦文章
- [MobX vs Redux: A Detailed Comparison](https://www.robinwieruch.de/redux-mobx/)
- [When to use MobX instead of Redux](https://blog.logrocket.com/mobx-vs-redux-which-is-better/)
- [MobX 6 Migration Guide](https://mobx.js.org/migrating-from-4-or-5.html)

## 🎯 最佳實踐

### 1. 使用 makeAutoObservable

```typescript
// ✅ 好的做法
class TodoStore {
  todos: Todo[] = [];

  constructor() {
    makeAutoObservable(this); // 自動處理
  }
}

// ❌ 不好的做法
class TodoStore {
  todos: Todo[] = [];

  constructor() {
    makeObservable(this, {
      todos: observable,
      addTodo: action,
      filteredTodos: computed,
      // ... 需要手動列舉所有
    });
  }
}
```

### 2. 保持 Store 職責單一

```typescript
// ✅ 好的做法：按功能拆分
class TodoStore {
  todos: Todo[] = [];
  // 只處理 todos 相關邏輯
}

class UserStore {
  user: User | null = null;
  // 只處理 user 相關邏輯
}

class UIStore {
  sidebarOpen = false;
  // 只處理 UI 相關邏輯
}

// ❌ 不好的做法：所有邏輯混在一起
class AppStore {
  todos: Todo[] = [];
  user: User | null = null;
  sidebarOpen = false;
  // 職責混亂
}
```

### 3. 使用 Computed 避免重複計算

```typescript
// ✅ 好的做法
class TodoStore {
  todos: Todo[] = [];

  get activeTodos() {
    console.log('Computing active todos...');
    return this.todos.filter(t => !t.completed);
  }
}

// 多次訪問只計算一次
const { activeTodos } = store;
console.log(activeTodos); // Computing...
console.log(activeTodos); // 使用緩存
console.log(activeTodos); // 使用緩存

// ❌ 不好的做法
class TodoStore {
  todos: Todo[] = [];

  getActiveTodos() { // 普通方法，不緩存
    console.log('Computing active todos...');
    return this.todos.filter(t => !t.completed);
  }
}

// 每次調用都計算
console.log(store.getActiveTodos()); // Computing...
console.log(store.getActiveTodos()); // Computing...
console.log(store.getActiveTodos()); // Computing...
```

### 4. 使用 observer HOC

```typescript
// ✅ 好的做法
const TodoList = observer(() => {
  const { todos } = todoStore;
  // 自動追蹤依賴，自動重渲染
  return <ul>{/* ... */}</ul>;
});

// ❌ 不好的做法
const TodoList = () => {
  const { todos } = todoStore;
  // 不會自動重渲染！
  return <ul>{/* ... */}</ul>;
};
```

## 🔍 常見問題

### Q: MobX 和 Redux 的主要區別是什麼？

**A:**
- **Redux**: 函數式、單向數據流、不可變數據、樣板代碼多
- **MobX**: 面向對象、響應式、可變數據、樣板代碼少

### Q: MobX 性能如何？

**A:** MobX 性能非常好：
- 細粒度更新，只重渲染必要的組件
- Computed values 自動緩存
- 自動批量更新

### Q: MobX 需要 Provider 嗎？

**A:** 不需要！直接創建 store 實例即可使用。

### Q: MobX 支持 TypeScript 嗎？

**A:** 完全支持！TypeScript 類型推斷非常好。

### Q: 何時使用 MobX 而非 Redux？

**A:**
- 中小型項目
- 追求開發效率
- 不想寫大量樣板代碼
- 熟悉 OOP 或 Vue

### Q: MobX 可以用於大型項目嗎？

**A:** 可以，但需要：
- 良好的 Store 組織
- 團隊規範
- 代碼審查

超大型項目（100+ 開發者）可能 Redux 更合適。

## 🎉 總結

MobX 是一個**簡單、直觀、高效**的響應式狀態管理庫，相比 Redux 和 Zustand：

### 優勢

- ✅ **代碼量最少**（比 Redux 減少 70%）
- ✅ **響應式編程**（自動追蹤依賴）
- ✅ **Computed values**（自動緩存）
- ✅ **細粒度更新**（性能最優）
- ✅ **無需 Provider**（使用簡單）
- ✅ **TypeScript 友好**（類型推斷完美）
- ✅ **OOP 風格**（適合複雜邏輯）

### 劣勢

- ❌ **學習曲線中等**（需要理解響應式）
- ❌ **無時間旅行**（調試功能較弱）
- ❌ **生態較小**（相比 Redux）

### 適用場景

對於**中型項目**和**追求開發效率**的團隊，MobX 是比 Redux 和 Zustand 更好的選擇！

---

## 📝 授權

MIT License
