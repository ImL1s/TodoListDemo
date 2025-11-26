# XState 狀態機視覺化指南

本文檔展示如何理解和可視化 Todo List 應用的狀態機。

## 狀態機核心概念

### 什麼是有限狀態機（FSM）？

有限狀態機是一個數學模型，用於描述系統行為。它包含：

1. **有限的狀態集合**（Finite States）
2. **事件**（Events）
3. **轉換**（Transitions）
4. **初始狀態**（Initial State）
5. **可選的最終狀態**（Final States）

### 為什麼使用狀態機？

```
傳統方式（Boolean flags）:
├── isLoading: true/false
├── isEditing: true/false
├── isSaving: true/false
└── isError: true/false

問題：256 種可能的組合！許多是不可能的狀態。

狀態機方式：
└── state: 'loading' | 'idle' | 'editing'

優勢：只有 3 種明確的狀態，不可能出現矛盾狀態。
```

## Todo List 狀態機完整圖解

### ASCII 藝術表示

```
                    ╔═══════════════════╗
                    ║   Application     ║
                    ║      Start        ║
                    ╚═════════╤═════════╝
                              │
                              ▼
                    ╔═════════════════════╗
                    ║      loading        ║
                    ║                     ║
                    ║  invoke:            ║
                    ║  ┌────────────────┐ ║
                    ║  │  loadTodos     │ ║
                    ║  │  Actor         │ ║
                    ║  └────────────────┘ ║
                    ╚═════╤═════════╤═════╝
                          │         │
                    onDone│         │onError
                          │         │
                          ▼         ▼
        ╔═══════════════════════════════════════════╗
        ║               idle                        ║
        ║                                           ║
        ║  ┌─────────────────────────────────────┐ ║
        ║  │ Events:                             │ ║
        ║  │                                     │ ║
        ║  │ ADD_TODO                            │ ║
        ║  │   ├─ guard: hasValidText            │ ║
        ║  │   └─ action: addTodo                │ ║
        ║  │                                     │ ║
        ║  │ DELETE_TODO                         │ ║
        ║  │   └─ action: deleteTodo             │ ║
        ║  │                                     │ ║
        ║  │ TOGGLE_TODO                         │ ║
        ║  │   └─ action: toggleTodo             │ ║
        ║  │                                     │ ║
        ║  │ SET_FILTER                          │ ║
        ║  │   └─ action: setFilter              │ ║
        ║  │                                     │ ║
        ║  │ CLEAR_COMPLETED                     │ ║
        ║  │   ├─ guard: hasCompletedTodos       │ ║
        ║  │   └─ action: clearCompleted         │ ║
        ║  │                                     │ ║
        ║  │ START_EDIT ──────────────────────┐  │ ║
        ║  │   ├─ action: startEdit           │  │ ║
        ║  │   └─ target: editing             │  │ ║
        ║  └─────────────────────────────────│──┘ ║
        ╚════════════════════════════════════│════╝
                                              │
                                              ▼
        ╔═══════════════════════════════════════════╗
        ║              editing                      ║
        ║                                           ║
        ║  ┌─────────────────────────────────────┐ ║
        ║  │ Events:                             │ ║
        ║  │                                     │ ║
        ║  │ UPDATE_TODO                         │ ║
        ║  │   ├─ guard: hasEditText             │ ║
        ║  │   ├─ action: updateTodo             │ ║
        ║  │   └─ target: idle ────────────────┐ │ ║
        ║  │                                   │ │ ║
        ║  │ CANCEL_EDIT                       │ │ ║
        ║  │   ├─ action: cancelEdit           │ │ ║
        ║  │   └─ target: idle ────────────────┤ │ ║
        ║  │                                   │ │ ║
        ║  │ DELETE_TODO                       │ │ ║
        ║  │   ├─ action: [deleteTodo,         │ │ ║
        ║  │   │            cancelEdit]        │ │ ║
        ║  │   └─ target: idle ────────────────┘ │ ║
        ║  └─────────────────────────────────────┘ ║
        ╚═══════════════╤═══════════════════════════╝
                        │
                        └─────────────────────────┐
                                                  │
                                                  ▼
                                    ╔═══════════════════╗
                                    ║       idle        ║
                                    ╚═══════════════════╝
```

### 狀態詳解

#### 1. loading 狀態

```
State: loading
├── Entry: 應用啟動時進入
├── Activities:
│   └── Invoke loadTodos actor
│       ├── 從 localStorage 讀取數據
│       └── 模擬異步加載（500ms delay）
├── Transitions:
│   ├── onDone → idle (加載成功)
│   └── onError → idle (加載失敗)
└── Exit: 數據加載完成
```

**用途：**
- 初始化應用
- 從持久化存儲加載數據
- 顯示加載指示器

#### 2. idle 狀態

```
State: idle
├── Description: 主要操作狀態
├── Available Events:
│   ├── ADD_TODO
│   │   ├── Guard: hasValidText
│   │   └── Action: addTodo
│   ├── DELETE_TODO
│   │   └── Action: deleteTodo
│   ├── TOGGLE_TODO
│   │   └── Action: toggleTodo
│   ├── SET_FILTER
│   │   └── Action: setFilter
│   ├── CLEAR_COMPLETED
│   │   ├── Guard: hasCompletedTodos
│   │   └── Action: clearCompleted
│   └── START_EDIT
│       ├── Action: startEdit
│       └── Target: editing
└── Characteristics:
    ├── 可以執行所有 CRUD 操作
    ├── 可以切換篩選器
    └── 可以進入編輯狀態
```

**用途：**
- 正常的 Todo 管理操作
- 列表查看和篩選
- 狀態切換

#### 3. editing 狀態

```
State: editing
├── Entry: 雙擊 Todo 項目
├── Context Changes:
│   └── editing: { id: string, text: string }
├── Available Events:
│   ├── UPDATE_TODO
│   │   ├── Guard: hasEditText
│   │   ├── Action: updateTodo
│   │   └── Target: idle
│   ├── CANCEL_EDIT
│   │   ├── Action: cancelEdit
│   │   └── Target: idle
│   └── DELETE_TODO
│       ├── Action: [deleteTodo, cancelEdit]
│       └── Target: idle
└── Exit: 編輯完成或取消
```

**用途：**
- 編輯 Todo 文字
- 保存或取消修改
- 在編輯時刪除項目

## 事件流程詳解

### 1. 新增 Todo 完整流程

```
用戶操作：在輸入框輸入 "Buy milk" 並按 Enter
    │
    ▼
Component: AddTodo
    │ handleSubmit()
    ▼
    send({ type: 'ADD_TODO', text: 'Buy milk' })
    │
    ▼
State Machine: todoMachine
    │ 當前狀態：idle
    ▼
    檢查轉換規則：
    ├── 事件類型：ADD_TODO ✓
    ├── Guard: hasValidText
    │   └── text.trim().length > 0 ✓
    └── Action: addTodo
        │
        ▼
        assign({
          todos: ({ context, event }) => {
            1. 創建新 Todo 對象
               ├── id: Date.now().toString()
               ├── text: 'Buy milk'
               ├── completed: false
               └── createdAt: Date.now()

            2. 添加到 todos 數組
               updatedTodos = [...context.todos, newTodo]

            3. 保存到 localStorage
               localStorage.setItem('xstate-todos', JSON.stringify(updatedTodos))

            4. 返回新的 todos
               return updatedTodos
          }
        })
    │
    ▼
State Machine: 仍在 idle 狀態
    │ context.todos 已更新
    ▼
React: useMachine 重新渲染
    │
    ▼
Component: TodoList
    │ 接收新的 todos 列表
    ▼
UI 更新：顯示新的 Todo 項目
```

### 2. 編輯 Todo 完整流程

```
用戶操作：雙擊 "Buy milk" Todo
    │
    ▼
Component: TodoItem
    │ onDoubleClick
    ▼
    onStartEdit(todo.id, todo.text)
    │
    ▼
    send({ type: 'START_EDIT', id: '123', text: 'Buy milk' })
    │
    ▼
State Machine: todoMachine
    │ 當前狀態：idle
    ▼
    檢查轉換規則：
    ├── 事件類型：START_EDIT ✓
    ├── Target: editing
    └── Action: startEdit
        │
        ▼
        assign({
          editing: { id: '123', text: 'Buy milk' }
        })
    │
    ▼
State Machine: 轉換到 editing 狀態
    │ context.editing = { id: '123', text: 'Buy milk' }
    ▼
React: useMachine 重新渲染
    │
    ▼
Component: TodoItem
    │ isEditing = true
    │ 顯示輸入框，聚焦並選中文字
    ▼
用戶操作：修改為 "Buy organic milk" 並按 Enter
    │
    ▼
Component: TodoItem
    │ onKeyDown (Enter)
    ▼
    onUpdate(todo.id, 'Buy organic milk')
    │
    ▼
    send({ type: 'UPDATE_TODO', id: '123', text: 'Buy organic milk' })
    │
    ▼
State Machine: todoMachine
    │ 當前狀態：editing
    ▼
    檢查轉換規則：
    ├── 事件類型：UPDATE_TODO ✓
    ├── Guard: hasEditText
    │   └── editing.text.trim().length > 0 ✓
    ├── Target: idle
    └── Action: updateTodo
        │
        ▼
        assign({
          todos: ({ context, event }) => {
            1. 更新指定的 Todo
               updatedTodos = context.todos.map(todo =>
                 todo.id === '123'
                   ? { ...todo, text: 'Buy organic milk' }
                   : todo
               )

            2. 保存到 localStorage
               localStorage.setItem('xstate-todos', JSON.stringify(updatedTodos))

            3. 返回新的 todos
               return updatedTodos
          },
          editing: null
        })
    │
    ▼
State Machine: 轉換回 idle 狀態
    │ context.editing = null
    │ context.todos 已更新
    ▼
React: useMachine 重新渲染
    │
    ▼
Component: TodoItem
    │ isEditing = false
    │ 顯示更新後的文字
    ▼
UI 更新：完成編輯
```

## Guards（守衛）工作原理

### Guard: hasValidText

```typescript
// 定義
hasValidText: ({ event }) => {
  return 'text' in event && event.text.trim().length > 0;
}

// 使用
on: {
  ADD_TODO: {
    guard: 'hasValidText',  // Guard 名稱
    actions: 'addTodo',     // Guard 通過才執行
  }
}
```

**執行流程：**

```
Event: ADD_TODO { text: '   ' }
    │
    ▼
Guard: hasValidText
    │ text.trim().length > 0
    │ ''.length > 0
    │ false ✗
    ▼
Action: addTodo
    │ 不執行 ✗
    ▼
State: 保持 idle
    │ context 不變
    ▼
Result: 空白 Todo 不會被添加 ✓
```

## Actions（動作）工作原理

### Action: addTodo

```typescript
// 定義
actions: {
  addTodo: assign({
    todos: ({ context, event }) => {
      // 1. 訪問當前 context
      const currentTodos = context.todos;

      // 2. 訪問事件數據
      const text = event.text;

      // 3. 創建新狀態
      const newTodo = {
        id: Date.now().toString(),
        text: text.trim(),
        completed: false,
        createdAt: Date.now(),
      };

      // 4. 副作用
      const updatedTodos = [...currentTodos, newTodo];
      saveTodosToStorage(updatedTodos);

      // 5. 返回新值
      return updatedTodos;
    },
  }),
}
```

**關鍵點：**

1. **不可變性**：必須返回新的引用
2. **純函數**：相同輸入產生相同輸出
3. **副作用**：可以在 action 中執行（如 localStorage）
4. **類型安全**：TypeScript 檢查 context 和 event 類型

## Actors（執行者）工作原理

### Actor: loadTodos

```typescript
// 定義
const loadTodosActor = fromPromise(async () => {
  // 模擬異步操作
  await new Promise(resolve => setTimeout(resolve, 500));

  // 執行實際邏輯
  return loadTodosFromStorage();
});

// 在狀態機中使用
states: {
  loading: {
    invoke: {
      src: 'loadTodos',         // Actor 名稱
      onDone: {                 // 成功時
        target: 'idle',
        actions: assign({
          todos: ({ event }) => event.output,
        }),
      },
      onError: {                // 失敗時
        target: 'idle',
        actions: assign({
          error: 'Failed to load todos',
        }),
      },
    },
  },
}
```

**執行流程：**

```
State: loading
    │
    ▼
Invoke: loadTodos Actor
    │
    ├─► Promise 開始執行
    │   │
    │   ├─ 等待 500ms
    │   │
    │   ├─ 讀取 localStorage
    │   │
    │   └─ 返回 todos 數組
    │
    ▼
Promise 完成（onDone）
    │
    ├─ event.output = todos
    │
    ├─ Action: assign todos
    │
    └─ Target: idle
        │
        ▼
State: idle
    │ todos 已加載
```

## 可視化工具使用

### XState Visualizer

**步驟：**

1. 打開 https://stately.ai/viz
2. 刪除默認代碼
3. 複製 `src/machines/todoMachine.ts` 的完整代碼
4. 貼上到編輯器
5. 點擊 "Visualize"

**功能：**

- 📊 查看狀態圖
- 🔄 查看狀態轉換
- 🎯 互動式測試
- 📝 查看事件和 guards
- 🔍 放大/縮小
- 💾 導出圖像

### Stately Studio

**步驟：**

1. 打開 https://stately.ai/editor
2. 註冊/登錄
3. 創建新項目
4. 導入代碼或可視化設計
5. 實時預覽和測試

**優勢：**

- 🎨 可視化編輯器
- 🤝 團隊協作
- 📚 項目管理
- 🔄 版本控制
- 📤 導出代碼
- 🧪 測試工具

## 調試技巧

### 1. 狀態追蹤

```typescript
useEffect(() => {
  console.log('State changed:', {
    value: state.value,
    context: state.context,
    nextEvents: state.nextEvents,
  });
}, [state]);
```

### 2. 事件日誌

```typescript
const [state, send] = useMachine(todoMachine, {
  inspect: (inspectionEvent) => {
    if (inspectionEvent.type === '@xstate.event') {
      console.log('Event sent:', inspectionEvent.event);
    }
    if (inspectionEvent.type === '@xstate.snapshot') {
      console.log('State updated:', inspectionEvent.snapshot.value);
    }
  },
});
```

### 3. 時間旅行調試

```typescript
// 記錄所有事件
const events: TodoEvent[] = [];

const customSend = (event: TodoEvent) => {
  events.push(event);
  send(event);
};

// 重放事件
const replay = () => {
  const actor = createActor(todoMachine);
  actor.start();

  events.forEach(event => {
    actor.send(event);
  });

  return actor.getSnapshot();
};
```

## 最佳實踐

### 1. 狀態設計

✅ **好的設計：**
```typescript
states: {
  loading: {},
  idle: {},
  editing: {},
}
```

❌ **避免：**
```typescript
// 不要用 boolean flags
context: {
  isLoading: false,
  isEditing: false,
  isDeleting: false,
}
```

### 2. 事件命名

✅ **好的命名：**
```typescript
{ type: 'ADD_TODO' }
{ type: 'DELETE_TODO' }
{ type: 'TOGGLE_TODO' }
```

❌ **避免：**
```typescript
{ type: 'add' }
{ type: 'remove' }
{ type: 'change' }
```

### 3. Guard 使用

✅ **好的使用：**
```typescript
guards: {
  hasValidText: ({ event }) => {
    return 'text' in event && event.text.trim().length > 0;
  },
}
```

❌ **避免：**
```typescript
// 不要在 action 中做條件判斷
actions: {
  addTodo: assign({
    todos: ({ context, event }) => {
      if (!event.text.trim()) return context.todos;
      // ...
    },
  }),
}
```

## 總結

XState 狀態機提供了：

1. **明確的狀態定義**：loading, idle, editing
2. **清晰的狀態轉換**：通過事件觸發
3. **條件控制**：使用 guards
4. **副作用處理**：使用 actions 和 actors
5. **可視化能力**：狀態圖一目了然
6. **類型安全**：完整的 TypeScript 支持

這使得應用邏輯更加可預測、可測試和可維護！
