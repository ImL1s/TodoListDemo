# XState 狀態機深度指南

本文檔詳細說明 XState 在 Todo List 應用中的使用方式。

## 狀態機架構圖

### 完整狀態轉換圖

```
                    ┌─────────────────┐
                    │   Application   │
                    │     Start       │
                    └────────┬────────┘
                             │
                             v
                    ┌────────────────┐
                    │    loading     │
                    │                │
                    │ invoke:        │
                    │  loadTodos     │
                    └────┬──────┬────┘
                         │      │
                  onDone │      │ onError
                         │      │
                         v      v
         ┌───────────────────────────────────┐
         │             idle                  │
         │                                   │
         │  Events:                          │
         │  • ADD_TODO                       │
         │    → guard: hasValidText          │
         │    → action: addTodo              │
         │                                   │
         │  • DELETE_TODO                    │
         │    → action: deleteTodo           │
         │                                   │
         │  • TOGGLE_TODO                    │
         │    → action: toggleTodo           │
         │                                   │
         │  • SET_FILTER                     │
         │    → action: setFilter            │
         │                                   │
         │  • CLEAR_COMPLETED                │
         │    → guard: hasCompletedTodos     │
         │    → action: clearCompleted       │
         │                                   │
         │  • START_EDIT                     │
         │    → action: startEdit            │
         │    → target: editing              │
         └───────────────┬───────────────────┘
                         │
                         │ START_EDIT
                         │
                         v
         ┌───────────────────────────────────┐
         │           editing                 │
         │                                   │
         │  Events:                          │
         │  • UPDATE_TODO                    │
         │    → guard: hasEditText           │
         │    → action: updateTodo           │
         │    → target: idle                 │
         │                                   │
         │  • CANCEL_EDIT                    │
         │    → action: cancelEdit           │
         │    → target: idle                 │
         │                                   │
         │  • DELETE_TODO                    │
         │    → action: [deleteTodo,         │
         │                cancelEdit]        │
         │    → target: idle                 │
         └───────────────────────────────────┘
```

## Context 數據結構

### 完整 Context 定義

```typescript
interface TodoContext {
  todos: Todo[];              // 所有 Todo 項目
  filter: FilterType;         // 當前篩選器 ('all' | 'active' | 'completed')
  editing: EditingState | null; // 當前編輯狀態
  error: string | null;       // 錯誤信息
}

interface Todo {
  id: string;                 // 唯一 ID
  text: string;               // Todo 文字
  completed: boolean;         // 完成狀態
  createdAt: number;          // 創建時間戳
}

interface EditingState {
  id: string;                 // 正在編輯的 Todo ID
  text: string;               // 編輯中的文字
}
```

## 事件流詳解

### 1. 新增 Todo 流程

```
用戶輸入 → ADD_TODO 事件
           ↓
       hasValidText Guard
       (檢查文字是否有效)
           ↓
       addTodo Action
       (新增 Todo 到列表)
           ↓
       saveTodosToStorage
       (保存到 localStorage)
           ↓
       UI 更新
```

**代碼範例：**

```typescript
// 發送事件
send({ type: 'ADD_TODO', text: 'Buy groceries' });

// Guard 檢查
guards: {
  hasValidText: ({ event }) => {
    return 'text' in event && event.text.trim().length > 0;
  },
}

// Action 執行
actions: {
  addTodo: assign({
    todos: ({ context, event }) => {
      const newTodo: Todo = {
        id: Date.now().toString(),
        text: event.text.trim(),
        completed: false,
        createdAt: Date.now(),
      };
      const updatedTodos = [...context.todos, newTodo];
      saveTodosToStorage(updatedTodos);
      return updatedTodos;
    },
  }),
}
```

### 2. 編輯 Todo 流程

```
雙擊 Todo → START_EDIT 事件
           ↓
       startEdit Action
       (設置 editing 狀態)
           ↓
       轉換到 editing 狀態
           ↓
       用戶修改文字
           ↓
       UPDATE_TODO 事件
           ↓
       hasEditText Guard
           ↓
       updateTodo Action
       (更新 Todo)
           ↓
       轉換回 idle 狀態
```

**狀態轉換：**

```typescript
// idle 狀態
idle: {
  on: {
    START_EDIT: {
      target: 'editing',
      actions: 'startEdit',
    },
  },
}

// editing 狀態
editing: {
  on: {
    UPDATE_TODO: {
      guard: 'hasEditText',
      target: 'idle',
      actions: 'updateTodo',
    },
    CANCEL_EDIT: {
      target: 'idle',
      actions: 'cancelEdit',
    },
  },
}
```

### 3. 刪除 Todo 流程

```
點擊刪除按鈕 → DELETE_TODO 事件
              ↓
          deleteTodo Action
          (從列表中移除)
              ↓
          saveTodosToStorage
              ↓
          UI 更新
```

### 4. 切換完成狀態流程

```
點擊 checkbox → TOGGLE_TODO 事件
              ↓
          toggleTodo Action
          (切換 completed 狀態)
              ↓
          saveTodosToStorage
              ↓
          UI 更新
```

## Guards（守衛）詳解

Guards 是條件判斷函數，決定是否允許某個轉換發生。

### 1. hasValidText

**用途：** 檢查新增或更新的 Todo 文字是否有效

```typescript
hasValidText: ({ event }) => {
  return 'text' in event && event.text.trim().length > 0;
}
```

**使用場景：**
- 新增 Todo 時，確保文字不為空
- 防止添加空白 Todo

### 2. hasCompletedTodos

**用途：** 檢查是否有已完成的 Todo

```typescript
hasCompletedTodos: ({ context }) => {
  return context.todos.some(todo => todo.completed);
}
```

**使用場景：**
- 清除已完成 Todos 時
- 只在有已完成項目時允許清除操作

### 3. hasEditText

**用途：** 檢查編輯的文字是否有效

```typescript
hasEditText: ({ context }) => {
  return context.editing !== null &&
         context.editing.text.trim().length > 0;
}
```

**使用場景：**
- 更新 Todo 時
- 防止更新為空文字

## Actions（動作）詳解

Actions 處理副作用和狀態更新。

### 1. assign Actions

使用 `assign` 更新 context：

```typescript
actions: {
  addTodo: assign({
    todos: ({ context, event }) => {
      // 返回新的 todos 數組
      return [...context.todos, newTodo];
    },
  }),
}
```

**重要規則：**
- 必須返回新的引用（不可變性）
- 可以訪問當前 context 和 event
- 支持多個字段同時更新

### 2. 副作用 Actions

處理 localStorage 等副作用：

```typescript
const saveTodosToStorage = (todos: Todo[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
  } catch (error) {
    console.error('Failed to save todos:', error);
  }
};

// 在 assign 中調用
actions: {
  addTodo: assign({
    todos: ({ context, event }) => {
      const updatedTodos = [...context.todos, newTodo];
      saveTodosToStorage(updatedTodos); // 副作用
      return updatedTodos;
    },
  }),
}
```

### 3. 複合 Actions

多個 actions 組合執行：

```typescript
editing: {
  on: {
    DELETE_TODO: {
      target: 'idle',
      actions: ['deleteTodo', 'cancelEdit'], // 依次執行
    },
  },
}
```

## Actors（執行者）詳解

Actors 處理異步操作和複雜邏輯。

### fromPromise Actor

```typescript
import { fromPromise } from 'xstate';

const loadTodosActor = fromPromise(async () => {
  // 模擬異步加載
  await new Promise(resolve => setTimeout(resolve, 500));
  return loadTodosFromStorage();
});

// 在狀態機中使用
setup({
  actors: {
    loadTodos: loadTodosActor,
  },
}).createMachine({
  states: {
    loading: {
      invoke: {
        src: 'loadTodos',
        onDone: {
          target: 'idle',
          actions: assign({
            todos: ({ event }) => event.output,
          }),
        },
        onError: {
          target: 'idle',
          actions: assign({
            error: 'Failed to load todos',
          }),
        },
      },
    },
  },
});
```

## 使用 @xstate/react

### useMachine Hook

```typescript
import { useMachine } from '@xstate/react';
import { todoMachine } from './machines/todoMachine';

function App() {
  const [state, send] = useMachine(todoMachine);

  // 讀取狀態
  const isLoading = state.matches('loading');
  const isEditing = state.matches('editing');
  const todos = state.context.todos;

  // 發送事件
  const addTodo = (text: string) => {
    send({ type: 'ADD_TODO', text });
  };

  return (
    <div>
      {isLoading && <LoadingSpinner />}
      {/* ... */}
    </div>
  );
}
```

### 檢查狀態

```typescript
// 單個狀態
state.matches('idle') // true/false

// 嵌套狀態
state.matches({ idle: 'displaying' })

// 多個狀態（OR）
state.matches('loading') || state.matches('idle')
```

### 訪問 Context

```typescript
// 直接訪問
const todos = state.context.todos;
const filter = state.context.filter;

// 解構
const { todos, filter, editing } = state.context;
```

## 調試技巧

### 1. 狀態檢查

```typescript
console.log('Current state:', state.value);
console.log('Context:', state.context);
```

### 2. 事件日誌

```typescript
const [state, send] = useMachine(todoMachine, {
  inspect: (inspectionEvent) => {
    console.log('Inspection Event:', inspectionEvent);
  },
});
```

### 3. 狀態轉換追蹤

```typescript
useEffect(() => {
  console.log('State changed to:', state.value);
}, [state.value]);
```

## 測試狀態機

### 單元測試範例

```typescript
import { createActor } from 'xstate';
import { todoMachine } from './todoMachine';

describe('Todo Machine', () => {
  it('should add a todo', () => {
    const actor = createActor(todoMachine);
    actor.start();

    actor.send({ type: 'ADD_TODO', text: 'Test todo' });

    const snapshot = actor.getSnapshot();
    expect(snapshot.context.todos).toHaveLength(1);
    expect(snapshot.context.todos[0].text).toBe('Test todo');
  });

  it('should not add empty todo', () => {
    const actor = createActor(todoMachine);
    actor.start();

    actor.send({ type: 'ADD_TODO', text: '   ' });

    const snapshot = actor.getSnapshot();
    expect(snapshot.context.todos).toHaveLength(0);
  });

  it('should transition to editing state', () => {
    const actor = createActor(todoMachine);
    actor.start();

    // 先添加一個 todo
    actor.send({ type: 'ADD_TODO', text: 'Test' });
    const todo = actor.getSnapshot().context.todos[0];

    // 開始編輯
    actor.send({ type: 'START_EDIT', id: todo.id, text: todo.text });

    const snapshot = actor.getSnapshot();
    expect(snapshot.matches('editing')).toBe(true);
    expect(snapshot.context.editing).not.toBeNull();
  });
});
```

## 性能優化

### 1. 選擇性訂閱

```typescript
// 只訂閱需要的部分
const todos = useSelector(state, (s) => s.context.todos);
const filter = useSelector(state, (s) => s.context.filter);
```

### 2. 使用 useMemo

```typescript
const filteredTodos = useMemo(() => {
  return todos.filter(todo => {
    if (filter === 'active') return !todo.completed;
    if (filter === 'completed') return todo.completed;
    return true;
  });
}, [todos, filter]);
```

### 3. 避免不必要的狀態更新

```typescript
// 使用 guards 防止無效更新
on: {
  ADD_TODO: {
    guard: 'hasValidText', // 只有有效文字才更新
    actions: 'addTodo',
  },
}
```

## XState 進階模式

### 1. 並行狀態

```typescript
states: {
  display: {
    type: 'parallel',
    states: {
      todos: {
        initial: 'loading',
        states: {
          loading: {},
          idle: {},
        },
      },
      filters: {
        initial: 'all',
        states: {
          all: {},
          active: {},
          completed: {},
        },
      },
    },
  },
}
```

### 2. 歷史狀態

```typescript
states: {
  editing: {
    history: 'deep',
    states: {
      text: {},
      tags: {},
    },
  },
}
```

### 3. 延遲事件

```typescript
states: {
  idle: {
    after: {
      3000: {
        target: 'timeout',
        actions: 'showTimeoutMessage',
      },
    },
  },
}
```

## 總結

XState 提供了一個強大且可預測的狀態管理解決方案：

- **明確的狀態定義**：每個狀態都是明確的
- **可視化**：狀態機可以被視覺化
- **類型安全**：完整的 TypeScript 支持
- **可測試**：每個狀態和轉換都可以測試
- **可維護**：業務邏輯清晰可見

對於複雜的狀態管理需求，XState 是一個優秀的選擇！
