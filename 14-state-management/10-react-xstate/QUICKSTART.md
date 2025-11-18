# XState Todo List - 快速開始指南

## 5 分鐘快速上手

### 1. 安裝依賴

```bash
npm install
```

### 2. 啟動開發服務器

```bash
npm run dev
```

訪問 http://localhost:5173

### 3. 開始使用

- **新增 Todo**：在輸入框中輸入文字，按 Enter 或點擊 "Add" 按鈕
- **完成 Todo**：點擊 checkbox 切換完成狀態
- **編輯 Todo**：雙擊 Todo 文字進入編輯模式
- **刪除 Todo**：點擊右側的 × 按鈕
- **篩選 Todo**：使用底部的 All/Active/Completed 按鈕
- **清除已完成**：點擊 "Clear completed" 按鈕

## 核心概念一覽

### 狀態機（State Machine）

XState 使用有限狀態機來管理應用狀態：

```
loading → idle ⇄ editing
```

- **loading**: 初始加載狀態
- **idle**: 正常操作狀態
- **editing**: 編輯 Todo 狀態

### 事件（Events）

```typescript
// 新增 Todo
send({ type: 'ADD_TODO', text: 'Buy milk' });

// 刪除 Todo
send({ type: 'DELETE_TODO', id: '123' });

// 切換完成狀態
send({ type: 'TOGGLE_TODO', id: '123' });

// 開始編輯
send({ type: 'START_EDIT', id: '123', text: 'Edit this' });

// 更新 Todo
send({ type: 'UPDATE_TODO', id: '123', text: 'New text' });

// 取消編輯
send({ type: 'CANCEL_EDIT' });

// 設置篩選器
send({ type: 'SET_FILTER', filter: 'active' });

// 清除已完成
send({ type: 'CLEAR_COMPLETED' });
```

### 上下文（Context）

```typescript
{
  todos: [...],           // Todo 列表
  filter: 'all',         // 當前篩選器
  editing: null,         // 編輯狀態
  error: null           // 錯誤信息
}
```

## 關鍵代碼位置

### 狀態機定義

📁 `src/machines/todoMachine.ts`

這是應用的核心，定義了所有狀態、事件、轉換和動作。

```typescript
export const todoMachine = setup({
  types: { /* ... */ },
  guards: { /* 條件判斷 */ },
  actions: { /* 狀態更新 */ },
  actors: { /* 異步操作 */ },
}).createMachine({
  id: 'todoApp',
  initial: 'loading',
  context: { /* 初始數據 */ },
  states: { /* 狀態定義 */ },
});
```

### React 集成

📁 `src/App.tsx`

使用 `useMachine` hook 連接狀態機：

```typescript
import { useMachine } from '@xstate/react';
import { todoMachine } from './machines/todoMachine';

function App() {
  const [state, send] = useMachine(todoMachine);

  // 讀取狀態
  const { todos, filter, editing } = state.context;

  // 發送事件
  const handleAddTodo = (text: string) => {
    send({ type: 'ADD_TODO', text });
  };

  // ...
}
```

### 組件結構

- 📁 `src/components/AddTodo.tsx` - 新增 Todo 輸入框
- 📁 `src/components/TodoList.tsx` - Todo 列表容器
- 📁 `src/components/TodoItem.tsx` - 單個 Todo 項目
- 📁 `src/components/TodoFilters.tsx` - 篩選器和統計

## 視覺化狀態機

### 方法 1：使用 XState Visualizer

1. 複製 `src/machines/todoMachine.ts` 的代碼
2. 前往 https://stately.ai/viz
3. 貼上代碼
4. 互動式查看狀態圖

### 方法 2：使用 Stately Studio

1. 前往 https://stately.ai/editor
2. 創建新項目
3. 導入或手動創建狀態機
4. 可視化編輯和測試

## 調試技巧

### 查看當前狀態

頁面頭部顯示當前狀態：

```
[loading] Powered by XState
[idle] Powered by XState
[editing] Powered by XState
```

### 查看 Context

頁面底部有一個可折疊的調試面板：

```
View State Context (Debug)
```

點擊可查看完整的 context 數據。

### 添加日誌

在 `useMachine` 中添加 inspect 選項：

```typescript
const [state, send] = useMachine(todoMachine, {
  inspect: (event) => {
    console.log('XState Event:', event);
  },
});
```

## localStorage 持久化

應用自動將 todos 保存到 localStorage：

- **鍵名**: `xstate-todos`
- **格式**: JSON 數組
- **時機**: 每次修改後自動保存

### 手動查看數據

```javascript
// 在瀏覽器控制台
localStorage.getItem('xstate-todos');
```

### 清除數據

```javascript
// 在瀏覽器控制台
localStorage.removeItem('xstate-todos');
```

## 自定義和擴展

### 添加新的狀態

在 `todoMachine.ts` 中：

```typescript
states: {
  loading: { /* ... */ },
  idle: { /* ... */ },
  editing: { /* ... */ },
  syncing: { // 新狀態
    on: {
      SYNC_SUCCESS: 'idle',
      SYNC_FAILURE: 'idle',
    },
  },
}
```

### 添加新的事件

1. 更新事件類型：

```typescript
type TodoEvent =
  | { type: 'ADD_TODO'; text: string }
  | { type: 'SYNC_TODOS' } // 新事件
  // ...
```

2. 添加事件處理：

```typescript
idle: {
  on: {
    SYNC_TODOS: {
      target: 'syncing',
      actions: 'startSync',
    },
  },
}
```

### 添加新的 Guard

```typescript
guards: {
  hasValidText: ({ event }) => { /* ... */ },
  canSync: ({ context }) => { // 新 guard
    return context.todos.length > 0;
  },
}
```

### 添加新的 Action

```typescript
actions: {
  addTodo: assign({ /* ... */ }),
  startSync: ({ context }) => { // 新 action
    console.log('Starting sync...');
    // 同步邏輯
  },
}
```

## 常見問題

### Q: 為什麼需要使用狀態機？

A: 狀態機提供：
- 明確的狀態定義
- 可預測的狀態轉換
- 防止不可能的狀態
- 更好的可測試性
- 可視化的業務邏輯

### Q: XState 適合小型應用嗎？

A: XState 更適合中大型應用或複雜的狀態邏輯。對於簡單應用，可以考慮：
- useState/useReducer
- Zustand
- Jotai

### Q: 如何測試狀態機？

A: 使用 XState 的測試工具：

```typescript
import { createActor } from 'xstate';

const actor = createActor(todoMachine);
actor.start();

actor.send({ type: 'ADD_TODO', text: 'Test' });
expect(actor.getSnapshot().context.todos).toHaveLength(1);
```

### Q: 性能如何？

A: XState 性能良好，但需注意：
- 使用 guards 避免不必要的更新
- 使用 useMemo 緩存計算結果
- 避免過度深層的狀態嵌套

### Q: 可以與其他狀態管理一起使用嗎？

A: 可以！XState 可以與 Redux、MobX 等並存：
- XState 管理複雜的狀態流程
- 其他庫管理簡單的全局狀態

## 下一步

### 學習路徑

1. ✅ 完成本 Quick Start
2. 📖 閱讀 `README.md` 了解完整功能
3. 📚 閱讀 `XSTATE_GUIDE.md` 深入學習
4. 🎨 訪問 https://stately.ai/viz 可視化狀態機
5. 📺 觀看 XState 官方教程

### 實驗建議

- 添加 Todo 優先級功能
- 添加標籤功能
- 添加搜索功能
- 添加批量操作
- 添加撤銷/重做功能
- 添加服務器同步

### 資源鏈接

- [XState 官方文檔](https://xstate.js.org/docs/)
- [XState Visualizer](https://stately.ai/viz)
- [XState Catalog](https://xstate-catalogue.com/)
- [Stately Blog](https://stately.ai/blog)

---

**開始探索 XState 的強大功能吧！** 🚀

有限狀態機讓你的應用邏輯清晰、可預測、易維護！
