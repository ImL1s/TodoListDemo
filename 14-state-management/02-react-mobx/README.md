# MobX Todo List

一個使用 React + TypeScript + MobX 構建的現代化 Todo List 應用程式，展示 MobX 的響應式狀態管理能力。

## 目錄

- [MobX 簡介](#mobx-簡介)
- [核心特色](#核心特色)
- [功能列表](#功能列表)
- [技術棧](#技術棧)
- [快速開始](#快速開始)
- [專案結構](#專案結構)
- [MobX 核心概念](#mobx-核心概念)
- [響應式原理](#響應式原理)
- [與 Redux 的比較](#與-redux-的比較)
- [最佳實踐](#最佳實踐)
- [學習資源](#學習資源)

## MobX 簡介

MobX 是一個簡單、可擴展的狀態管理解決方案，通過透明的函數響應式編程（Transparent Functional Reactive Programming, TFRP）使狀態管理變得簡單和可擴展。

### 核心理念

```
狀態改變 → 自動更新衍生值 → 自動觸發副作用
```

MobX 會自動追蹤狀態的依賴關係，當狀態改變時，所有依賴該狀態的計算值和組件都會自動更新。

## 核心特色

### 1. 簡單直觀

```typescript
// 直接修改狀態，無需 reducers 或 actions 創建函數
todoStore.addTodo('新任務');
todo.completed = true;
```

### 2. 自動依賴追蹤

```typescript
// MobX 自動知道 filteredTodos 依賴 todos 和 filter
get filteredTodos() {
  return this.todos.filter(t =>
    this.filter === 'active' ? !t.completed : true
  );
}
```

### 3. 細粒度更新

只有實際改變的數據才會觸發重新渲染，性能優異。

### 4. 最小化樣板代碼

不需要 actions、reducers、selectors 等大量樣板代碼。

## 功能列表

- ✅ 新增 Todo
- ✅ 編輯 Todo（雙擊編輯）
- ✅ 刪除 Todo
- ✅ 切換完成狀態
- ✅ 篩選功能（全部、進行中、已完成）
- ✅ 批量操作（全部完成/取消完成）
- ✅ 清除已完成任務
- ✅ 實時統計（總數、進行中、已完成、完成率）
- ✅ localStorage 持久化
- ✅ 響應式設計
- ✅ 優雅的動畫效果

## 技術棧

- **React 18** - UI 框架
- **TypeScript** - 類型安全
- **MobX 6** - 狀態管理
- **mobx-react-lite** - React 集成
- **Vite** - 構建工具
- **CSS3** - 樣式和動畫

## 快速開始

### 安裝依賴

```bash
npm install
```

### 開發模式

```bash
npm run dev
```

應用將在 http://localhost:3002 啟動。

### 構建生產版本

```bash
npm run build
```

### 預覽生產版本

```bash
npm run preview
```

## 專案結構

```
02-react-mobx/
├── src/
│   ├── components/          # React 組件
│   │   ├── TodoForm.tsx    # 新增表單
│   │   ├── TodoItem.tsx    # 單個 Todo 項
│   │   ├── TodoList.tsx    # Todo 列表
│   │   ├── TodoFilters.tsx # 過濾器
│   │   └── TodoStats.tsx   # 統計信息
│   ├── stores/             # MobX Stores
│   │   └── TodoStore.ts    # Todo 狀態管理
│   ├── types/              # TypeScript 類型
│   │   └── todo.ts         # Todo 類型定義
│   ├── styles/             # 樣式文件
│   │   └── App.css         # 主樣式
│   ├── App.tsx             # 主應用組件
│   └── main.tsx            # 入口文件
├── index.html              # HTML 模板
├── package.json            # 專案配置
├── tsconfig.json           # TypeScript 配置
├── vite.config.ts          # Vite 配置
└── README.md               # 專案說明
```

## MobX 核心概念

### 1. Observable State（可觀察狀態）

使用 `makeAutoObservable` 將類的屬性轉換為可觀察狀態：

```typescript
class TodoStore {
  todos: Todo[] = [];
  filter: FilterType = 'all';

  constructor() {
    // 自動將所有屬性設為 observable
    makeAutoObservable(this);
  }
}
```

### 2. Actions（動作）

修改狀態的方法會自動成為 actions：

```typescript
// 直接修改狀態，MobX 會追蹤所有變化
addTodo(text: string) {
  this.todos.push({
    id: Date.now().toString(),
    text,
    completed: false,
  });
}

toggleTodo(id: string) {
  const todo = this.todos.find(t => t.id === id);
  if (todo) {
    todo.completed = !todo.completed;
  }
}
```

### 3. Computed Values（計算值）

使用 getter 定義計算屬性，MobX 會自動緩存並追蹤依賴：

```typescript
// 自動緩存，只在 todos 或 filter 改變時重新計算
get filteredTodos() {
  switch (this.filter) {
    case 'active':
      return this.todos.filter(t => !t.completed);
    case 'completed':
      return this.todos.filter(t => t.completed);
    default:
      return this.todos;
  }
}

get activeCount() {
  return this.todos.filter(t => !t.completed).length;
}
```

### 4. Observer（觀察者）

使用 `observer` 包裝組件，使其響應 observable 的變化：

```typescript
import { observer } from 'mobx-react-lite';

const TodoList = observer(() => {
  // 當 filteredTodos 依賴的數據改變時，組件自動重新渲染
  const todos = todoStore.filteredTodos;

  return (
    <ul>
      {todos.map(todo => (
        <TodoItem key={todo.id} todo={todo} />
      ))}
    </ul>
  );
});
```

## 響應式原理

### MobX 的響應式流程

```
1. 狀態改變（Observable State）
   ↓
2. 依賴追蹤（Automatic Dependency Tracking）
   ↓
3. 計算值更新（Computed Values）
   ↓
4. 組件重新渲染（Observer Components）
```

### 自動依賴追蹤

```typescript
// MobX 自動追蹤這些依賴：
const Stats = observer(() => {
  // 追蹤：todoStore.activeCount
  // 追蹤：todoStore.totalCount
  return (
    <div>
      <span>進行中: {todoStore.activeCount}</span>
      <span>總計: {todoStore.totalCount}</span>
    </div>
  );
});

// 當 todos 改變時：
// 1. activeCount 自動重新計算
// 2. totalCount 自動重新計算
// 3. Stats 組件自動重新渲染
```

### 細粒度更新

```typescript
// 只有被修改的 todo 對應的 TodoItem 會重新渲染
const TodoItem = observer(({ todo }) => {
  return (
    <li>
      <input
        type="checkbox"
        checked={todo.completed}  // 只追蹤這個 todo 的 completed
        onChange={() => todoStore.toggleTodo(todo.id)}
      />
      <span>{todo.text}</span>
    </li>
  );
});
```

## 與 Redux 的比較

### Redux 架構

```typescript
// 1. 定義 Action Types
const ADD_TODO = 'ADD_TODO';
const TOGGLE_TODO = 'TOGGLE_TODO';

// 2. 創建 Action Creators
const addTodo = (text: string) => ({
  type: ADD_TODO,
  payload: { text }
});

// 3. 定義 Reducer
const todoReducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_TODO:
      return {
        ...state,
        todos: [...state.todos, newTodo]
      };
    default:
      return state;
  }
};

// 4. 在組件中使用
const Component = () => {
  const dispatch = useDispatch();
  const todos = useSelector(state => state.todos);

  return <button onClick={() => dispatch(addTodo('新任務'))}>新增</button>;
};
```

### MobX 架構

```typescript
// 1. 定義 Store（一步完成）
class TodoStore {
  todos: Todo[] = [];

  constructor() {
    makeAutoObservable(this);
  }

  addTodo(text: string) {
    this.todos.push(newTodo);
  }
}

// 2. 在組件中使用
const Component = observer(() => {
  return (
    <button onClick={() => todoStore.addTodo('新任務')}>
      新增
    </button>
  );
});
```

### 對比總結

| 特性 | Redux | MobX |
|------|-------|------|
| **學習曲線** | 陡峭（需要理解多個概念） | 平緩（接近原生 JS） |
| **樣板代碼** | 多（actions, reducers, types） | 少（直接修改狀態） |
| **不可變性** | 必須手動維護 | 自動處理 |
| **依賴追蹤** | 手動 select | 自動追蹤 |
| **性能優化** | 需要手動優化（memo, selectors） | 自動細粒度更新 |
| **調試工具** | Redux DevTools | MobX DevTools |
| **適用場景** | 大型應用、需要時間旅行 | 中小型應用、快速開發 |

### 何時選擇 MobX

✅ **適合使用 MobX：**
- 希望減少樣板代碼
- 需要快速開發
- 團隊熟悉 OOP 模式
- 應用有大量計算衍生狀態
- 需要細粒度的性能優化

❌ **不適合使用 MobX：**
- 需要嚴格的狀態追蹤和時間旅行
- 團隊更熟悉函數式編程
- 需要與 Redux 生態系統集成

## 最佳實踐

### 1. 使用 makeAutoObservable

```typescript
class Store {
  data = [];

  constructor() {
    // 推薦：自動設置 observable, action, computed
    makeAutoObservable(this, {}, { autoBind: true });
  }
}
```

### 2. 將 Actions 保持在 Store 中

```typescript
// ✅ 好的做法
class TodoStore {
  todos = [];

  addTodo(text: string) {
    this.todos.push({ text, completed: false });
  }
}

// ❌ 避免在組件中直接修改
const Component = observer(() => {
  // 不要這樣做
  todoStore.todos.push({ text: 'new', completed: false });
});
```

### 3. 使用 Computed 優化計算

```typescript
class Store {
  todos = [];

  // ✅ 使用 computed，自動緩存
  get activeTodos() {
    return this.todos.filter(t => !t.completed);
  }

  // ❌ 避免在渲染中計算
  // Component: todos.filter(t => !t.completed)
}
```

### 4. 細粒度的 Observer 組件

```typescript
// ✅ 每個 item 是獨立的 observer
const TodoItem = observer(({ todo }) => {
  return <li>{todo.text}</li>;
});

const TodoList = observer(() => {
  return (
    <ul>
      {todoStore.todos.map(todo => (
        <TodoItem key={todo.id} todo={todo} />
      ))}
    </ul>
  );
});
```

### 5. 避免在 Render 中創建新的 Observable

```typescript
// ❌ 避免
const Component = observer(() => {
  const localStore = new Store(); // 每次渲染都創建新實例
  return <div>{localStore.value}</div>;
});

// ✅ 使用 useState 或模塊級別的 store
const store = new Store();
const Component = observer(() => {
  return <div>{store.value}</div>;
});
```

## 學習資源

### 官方資源

- [MobX 官方網站](https://mobx.js.org/)
- [MobX 官方文檔](https://mobx.js.org/README.html)
- [MobX React 集成](https://mobx.js.org/react-integration.html)
- [MobX GitHub](https://github.com/mobxjs/mobx)

### 教程和指南

- [MobX 快速入門](https://mobx.js.org/getting-started.html)
- [10 分鐘學會 MobX](https://mobx.js.org/the-gist-of-mobx.html)
- [MobX 最佳實踐](https://mobx.js.org/best-practices.html)
- [從 Redux 遷移到 MobX](https://mobx.js.org/migrating-from-redux.html)

### 進階主題

- [MobX 的原理](https://mobx.js.org/how-mobx-works.html)
- [MobX 性能優化](https://mobx.js.org/optimizations.html)
- [使用 Decorators](https://mobx.js.org/enabling-decorators.html)
- [MobX State Tree](https://mobx-state-tree.js.org/)

### 工具和插件

- [MobX DevTools](https://github.com/mobxjs/mobx-devtools)
- [mobx-react-devtools](https://github.com/mobxjs/mobx-react-devtools)
- [ESLint Plugin MobX](https://github.com/mobxjs/mobx/tree/main/packages/eslint-plugin-mobx)

### 社區資源

- [MobX 中文文檔](https://zh.mobx.js.org/)
- [Awesome MobX](https://github.com/mobxjs/awesome-mobx)
- [MobX Patterns](https://github.com/mobxjs/mobx/discussions)

## MobX 核心 API 速查

### Observable

```typescript
import { makeObservable, makeAutoObservable, observable } from 'mobx';

// 方式 1: makeAutoObservable（推薦）
class Store {
  value = 0;
  constructor() {
    makeAutoObservable(this);
  }
}

// 方式 2: makeObservable
class Store {
  value = 0;
  constructor() {
    makeObservable(this, {
      value: observable,
    });
  }
}
```

### Action

```typescript
import { action } from 'mobx';

class Store {
  value = 0;

  // 自動成為 action（使用 makeAutoObservable）
  increment() {
    this.value++;
  }

  // 或明確標記
  decrement = action(() => {
    this.value--;
  });
}
```

### Computed

```typescript
import { computed } from 'mobx';

class Store {
  todos = [];

  // 使用 getter（推薦）
  get completedCount() {
    return this.todos.filter(t => t.completed).length;
  }

  // 或明確標記
  @computed
  get activeCount() {
    return this.todos.filter(t => !t.completed).length;
  }
}
```

### Reaction

```typescript
import { reaction, autorun, when } from 'mobx';

// autorun: 立即執行並在依賴改變時重新執行
autorun(() => {
  console.log('Todos count:', store.todos.length);
});

// reaction: 只在依賴改變時執行
reaction(
  () => store.todos.length,
  (length) => console.log('Count changed to:', length)
);

// when: 條件為真時執行一次
when(
  () => store.todos.length > 10,
  () => console.log('More than 10 todos!')
);
```

## 常見問題

### Q: MobX 的性能如何？

A: MobX 的細粒度響應式系統使其性能非常優秀。只有真正改變的數據才會觸發更新，且 computed values 會自動緩存。

### Q: MobX 支持 TypeScript 嗎？

A: 完全支持！MobX 本身就是用 TypeScript 編寫的，提供完整的類型定義。

### Q: 可以在生產環境使用 MobX 嗎？

A: 當然可以！許多大型公司（如 Microsoft、Amazon）都在生產環境中使用 MobX。

### Q: MobX 6 有什麼變化？

A: MobX 6 主要改進：
- 默認不再需要 decorators
- makeAutoObservable 成為推薦做法
- 更好的 TypeScript 支持
- 更小的包體積

### Q: 如何調試 MobX 應用？

A: 使用 [MobX DevTools](https://github.com/mobxjs/mobx-devtools) 瀏覽器擴展，可以：
- 查看 observable 狀態
- 追蹤 actions 和 reactions
- 檢查依賴關係圖

## 授權

MIT License

## 貢獻

歡迎提交 Issues 和 Pull Requests！

---

**開始使用 MobX，體驗簡單而強大的響應式狀態管理！**
