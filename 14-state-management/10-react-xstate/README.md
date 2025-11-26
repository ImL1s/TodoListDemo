# React XState Todo List

一個使用 **XState** 狀態機管理的 Todo List 應用程式，展示了有限狀態機（Finite State Machines）在前端狀態管理中的強大能力。

## 特色功能

### XState 核心特性

1. **有限狀態機（Finite State Machines）**
   - 明確定義的狀態轉換
   - 防止不可能的狀態
   - 可預測的行為

2. **狀態圖（State Charts）**
   - 支持層次狀態
   - 並行狀態
   - 歷史狀態

3. **視覺化能力**
   - 可使用 XState Visualizer 視覺化狀態機
   - 狀態轉換圖一目了然
   - 易於理解和調試

4. **類型安全**
   - 完整的 TypeScript 支持
   - 事件和上下文的類型推斷
   - 編譯時錯誤檢查

### 應用程式功能

- ✅ 新增 Todo
- ✅ 編輯 Todo（雙擊編輯）
- ✅ 刪除 Todo
- ✅ 切換完成狀態
- ✅ 篩選功能（全部、進行中、已完成）
- ✅ localStorage 持久化
- ✅ 狀態機可視化指示器

## 安裝和運行

### 前置要求

- Node.js >= 18.0.0
- npm 或 yarn

### 安裝步驟

```bash
# 安裝依賴
npm install

# 開發模式運行
npm run dev

# 構建生產版本
npm run build

# 預覽生產版本
npm run preview
```

應用程式將在 `http://localhost:5173` 運行。

## 專案結構

```
10-react-xstate/
├── src/
│   ├── machines/
│   │   └── todoMachine.ts         # XState 狀態機定義
│   ├── components/
│   │   ├── AddTodo.tsx            # 新增 Todo 組件
│   │   ├── TodoItem.tsx           # Todo 項目組件
│   │   ├── TodoList.tsx           # Todo 列表組件
│   │   └── TodoFilters.tsx        # 篩選器組件
│   ├── types/
│   │   └── todo.ts                # TypeScript 類型定義
│   ├── styles/
│   │   └── App.css                # 應用程式樣式
│   ├── App.tsx                    # 主應用組件
│   └── main.tsx                   # 應用入口
├── index.html                     # HTML 模板
├── package.json                   # 項目配置
├── tsconfig.json                  # TypeScript 配置
├── vite.config.ts                 # Vite 配置
└── README.md                      # 專案文檔
```

## 狀態機設計說明

### 狀態定義

XState 狀態機包含以下主要狀態：

```typescript
states: {
  loading: {
    // 初始加載狀態
    // 從 localStorage 加載數據
  },
  idle: {
    // 主要狀態：可以進行所有操作
    // 新增、刪除、切換、篩選等
  },
  editing: {
    // 編輯狀態：正在編輯某個 Todo
    // 可以更新或取消編輯
  }
}
```

### 狀態轉換圖

```
┌─────────┐
│ loading │
└────┬────┘
     │
     v
┌────────────────────────────────────────┐
│              idle                      │
│  • ADD_TODO                           │
│  • DELETE_TODO                        │
│  • TOGGLE_TODO                        │
│  • SET_FILTER                         │
│  • CLEAR_COMPLETED                    │
│  • START_EDIT → editing               │
└────────────────────────────────────────┘
                    ↑
                    │
┌───────────────────┴─────────────────┐
│           editing                   │
│  • UPDATE_TODO → idle               │
│  • CANCEL_EDIT → idle               │
│  • DELETE_TODO → idle               │
└─────────────────────────────────────┘
```

### Context（上下文）

```typescript
interface TodoContext {
  todos: Todo[];              // Todo 列表
  filter: FilterType;         // 當前篩選器
  editing: EditingState | null; // 編輯狀態
  error: string | null;       // 錯誤信息
}
```

### Events（事件）

所有狀態機事件都是強類型的：

```typescript
type TodoEvent =
  | { type: 'ADD_TODO'; text: string }
  | { type: 'DELETE_TODO'; id: string }
  | { type: 'TOGGLE_TODO'; id: string }
  | { type: 'START_EDIT'; id: string; text: string }
  | { type: 'UPDATE_TODO'; id: string; text: string }
  | { type: 'CANCEL_EDIT' }
  | { type: 'SET_FILTER'; filter: FilterType }
  | { type: 'CLEAR_COMPLETED' };
```

### Actions（動作）

Actions 處理副作用和狀態更新：

```typescript
actions: {
  addTodo: assign({ /* 新增 Todo */ }),
  deleteTodo: assign({ /* 刪除 Todo */ }),
  toggleTodo: assign({ /* 切換狀態 */ }),
  updateTodo: assign({ /* 更新 Todo */ }),
  setFilter: assign({ /* 設置篩選器 */ }),
  // ... 更多 actions
}
```

### Guards（守衛）

Guards 用於條件判斷：

```typescript
guards: {
  hasValidText: ({ event }) => {
    return 'text' in event && event.text.trim().length > 0;
  },
  hasCompletedTodos: ({ context }) => {
    return context.todos.some(todo => todo.completed);
  },
  hasEditText: ({ context }) => {
    return context.editing !== null && context.editing.text.trim().length > 0;
  },
}
```

### Actors（執行者）

使用 Actors 處理異步操作：

```typescript
actors: {
  loadTodos: fromPromise(async () => {
    // 異步加載 todos
    return loadTodosFromStorage();
  }),
}
```

## XState 最佳實踐

### 1. 使用 `setup` 函數

XState 5.x 推薦使用 `setup` 函數來配置狀態機：

```typescript
export const todoMachine = setup({
  types: {
    context: {} as TodoContext,
    events: {} as TodoEvent,
  },
  guards: { /* ... */ },
  actions: { /* ... */ },
  actors: { /* ... */ },
}).createMachine({
  // 狀態機配置
});
```

### 2. 使用 `assign` 更新 Context

```typescript
actions: {
  addTodo: assign({
    todos: ({ context, event }) => {
      // 返回新的 todos 數組
    },
  }),
}
```

### 3. 使用 Guards 進行條件判斷

```typescript
on: {
  ADD_TODO: {
    guard: 'hasValidText',
    actions: 'addTodo',
  },
}
```

### 4. 使用 @xstate/react Hooks

```typescript
import { useMachine } from '@xstate/react';

const [state, send] = useMachine(todoMachine);

// 發送事件
send({ type: 'ADD_TODO', text: 'New todo' });

// 讀取狀態
console.log(state.value); // 'idle', 'editing', etc.
console.log(state.context.todos);
```

### 5. 類型安全

使用 TypeScript 確保類型安全：

```typescript
// 定義明確的類型
interface TodoContext { /* ... */ }
type TodoEvent = { /* ... */ };

// 在 setup 中聲明類型
setup({
  types: {
    context: {} as TodoContext,
    events: {} as TodoEvent,
  },
})
```

## 與其他狀態管理的比較

### XState vs Redux

| 特性 | XState | Redux |
|------|--------|-------|
| 狀態模型 | 有限狀態機 | 單一狀態樹 |
| 狀態轉換 | 顯式定義 | 通過 reducers |
| 副作用處理 | 內建 (actors, actions) | 需要中間件 |
| 視覺化 | 原生支持 | 需要額外工具 |
| 學習曲線 | 中等 | 較低 |
| 類型安全 | 優秀 | 良好 |
| 適用場景 | 複雜狀態流程 | 通用狀態管理 |

### XState vs Zustand

| 特性 | XState | Zustand |
|------|--------|---------|
| API 複雜度 | 較高 | 很低 |
| 狀態管理方式 | 狀態機 | 簡單 store |
| 可預測性 | 極高 | 中等 |
| 除錯能力 | 極強 | 一般 |
| Bundle 大小 | 較大 (~20KB) | 很小 (~1KB) |
| 適用場景 | 複雜業務邏輯 | 簡單狀態管理 |

### XState vs MobX

| 特性 | XState | MobX |
|------|--------|------|
| 響應式 | 否 | 是 |
| 狀態模型 | 顯式狀態機 | 可觀察對象 |
| 學習曲線 | 中等 | 中等 |
| 樣板代碼 | 較多 | 較少 |
| 可預測性 | 極高 | 中等 |
| 適用場景 | 複雜流程控制 | 響應式應用 |

## XState 的優勢

### 1. 防止不可能的狀態

```typescript
// 使用狀態機，不可能同時處於 loading 和 editing 狀態
// 狀態轉換是顯式定義的，防止意外的狀態組合
```

### 2. 可視化和理解性

- 使用 [XState Visualizer](https://stately.ai/viz) 可視化狀態機
- 狀態轉換圖讓業務邏輯一目了然
- 非技術人員也能理解狀態流程

### 3. 可測試性

```typescript
// 狀態機的每個狀態和轉換都可以單獨測試
import { createActor } from 'xstate';

const actor = createActor(todoMachine);
actor.start();

// 發送事件並驗證狀態
actor.send({ type: 'ADD_TODO', text: 'Test' });
expect(actor.getSnapshot().context.todos).toHaveLength(1);
```

### 4. 時間旅行和重放

- 可以記錄所有事件
- 重放事件序列進行調試
- 狀態快照和還原

## XState 的劣勢

1. **學習曲線較陡**：需要理解狀態機概念
2. **樣板代碼較多**：需要定義狀態、事件、轉換等
3. **Bundle 大小**：相比 Zustand 等輕量級方案較大
4. **過度設計風險**：簡單場景可能不需要狀態機

## 何時使用 XState

### 適合使用的場景

- ✅ 複雜的業務流程（如多步驟表單、向導）
- ✅ 需要嚴格狀態控制的應用
- ✅ 有明確狀態轉換邏輯的功能
- ✅ 需要可視化狀態流程
- ✅ 需要高度可測試性
- ✅ 團隊協作，需要清晰的狀態文檔

### 不適合使用的場景

- ❌ 簡單的狀態管理
- ❌ 只需要簡單的數據共享
- ❌ 團隊不熟悉狀態機概念
- ❌ 需要極小的 bundle 大小

## 學習資源

### 官方資源

- [XState 官方文檔](https://xstate.js.org/docs/)
- [XState Visualizer](https://stately.ai/viz) - 狀態機可視化工具
- [Stately Studio](https://stately.ai/editor) - 可視化狀態機編輯器
- [XState GitHub](https://github.com/statelyai/xstate)

### 教程和文章

- [Introduction to State Machines](https://xstate.js.org/docs/guides/introduction-to-state-machines-and-statecharts/)
- [XState Catalog](https://xstate-catalogue.com/) - 常見狀態機模式
- [XState 完全指南](https://www.youtube.com/watch?v=RqTxtOXcv8Y)
- [使用 XState 管理應用狀態](https://egghead.io/courses/introduction-to-state-machines-using-xstate)

### 進階主題

- [Actor Model](https://xstate.js.org/docs/guides/actors.html)
- [Parallel States](https://xstate.js.org/docs/guides/parallel.html)
- [History States](https://xstate.js.org/docs/guides/history.html)
- [Testing State Machines](https://xstate.js.org/docs/packages/xstate-test/)

### 社群資源

- [XState Discord](https://discord.gg/xstate)
- [Stack Overflow - xstate tag](https://stackoverflow.com/questions/tagged/xstate)
- [Reddit - r/xstate](https://www.reddit.com/r/xstate/)

## 視覺化你的狀態機

### 使用 XState Visualizer

1. 複製 `src/machines/todoMachine.ts` 的代碼
2. 前往 https://stately.ai/viz
3. 貼上代碼
4. 查看互動式狀態圖

### 使用 Stately Studio

1. 前往 https://stately.ai/editor
2. 創建新項目
3. 可視化編輯狀態機
4. 導出代碼

## 實用技巧

### 1. 狀態機調試

```typescript
// 在組件中顯示當前狀態
<div className="debug">
  Current State: {state.value}
  Context: {JSON.stringify(state.context, null, 2)}
</div>
```

### 2. 事件日誌

```typescript
const [state, send] = useMachine(todoMachine, {
  inspect: (event) => {
    console.log('Event:', event);
  },
});
```

### 3. 狀態持久化

```typescript
// 在 actions 中保存到 localStorage
actions: {
  saveTodos: ({ context }) => {
    localStorage.setItem('todos', JSON.stringify(context.todos));
  },
}
```

## 專案亮點

### 1. 完整的狀態機實現

- 使用 XState 5.x 最新 API
- 展示 guards、actions、actors 等核心概念
- 類型安全的事件和上下文

### 2. 最佳實踐

- 使用 `setup` 函數配置
- 使用 `assign` 更新 context
- 使用 `fromPromise` 處理異步操作
- 完整的 TypeScript 類型支持

### 3. 實用功能

- localStorage 持久化
- 狀態可視化指示器
- 調試用的 context 查看器
- 響應式設計

### 4. 教育價值

- 清晰的代碼結構
- 詳細的註釋
- 完整的文檔
- 易於理解的範例

## 許可證

MIT

## 貢獻

歡迎提交 Issue 和 Pull Request！

---

**Happy Coding with XState!** 🎉

有限狀態機讓狀態管理變得可預測、可測試、可視化！
