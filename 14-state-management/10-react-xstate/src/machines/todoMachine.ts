import { setup, assign, fromPromise } from 'xstate';
import { Todo, FilterType, EditingState } from '../types/todo';

// 定義 Context 類型
interface TodoContext {
  todos: Todo[];
  filter: FilterType;
  editing: EditingState | null;
  error: string | null;
}

// 定義事件類型
type TodoEvent =
  | { type: 'ADD_TODO'; text: string }
  | { type: 'DELETE_TODO'; id: string }
  | { type: 'TOGGLE_TODO'; id: string }
  | { type: 'START_EDIT'; id: string; text: string }
  | { type: 'UPDATE_TODO'; id: string; text: string }
  | { type: 'CANCEL_EDIT' }
  | { type: 'SET_FILTER'; filter: FilterType }
  | { type: 'CLEAR_COMPLETED' }
  | { type: 'LOAD_SUCCESS'; todos: Todo[] }
  | { type: 'LOAD_FAILURE'; error: string };

// LocalStorage 鍵
const STORAGE_KEY = 'xstate-todos';

// LocalStorage 操作
const loadTodosFromStorage = (): Todo[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Failed to load todos:', error);
    return [];
  }
};

const saveTodosToStorage = (todos: Todo[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
  } catch (error) {
    console.error('Failed to save todos:', error);
  }
};

// 創建異步加載 actor
const loadTodosActor = fromPromise(async () => {
  // 模擬異步加載
  await new Promise(resolve => setTimeout(resolve, 500));
  return loadTodosFromStorage();
});

// 使用 setup 函數創建狀態機配置
export const todoMachine = setup({
  types: {
    context: {} as TodoContext,
    events: {} as TodoEvent,
  },
  actors: {
    loadTodos: loadTodosActor,
  },
  guards: {
    // Guard: 檢查是否有待編輯的文字
    hasEditText: ({ context }) => {
      return context.editing !== null && context.editing.text.trim().length > 0;
    },
    // Guard: 檢查新增的 Todo 文字是否有效
    hasValidText: ({ event }) => {
      return 'text' in event && event.text.trim().length > 0;
    },
    // Guard: 檢查是否有已完成的 Todo
    hasCompletedTodos: ({ context }) => {
      return context.todos.some(todo => todo.completed);
    },
  },
  actions: {
    // Action: 新增 Todo
    addTodo: assign({
      todos: ({ context, event }) => {
        if (event.type !== 'ADD_TODO') return context.todos;

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

    // Action: 刪除 Todo
    deleteTodo: assign({
      todos: ({ context, event }) => {
        if (event.type !== 'DELETE_TODO') return context.todos;

        const updatedTodos = context.todos.filter(todo => todo.id !== event.id);
        saveTodosToStorage(updatedTodos);
        return updatedTodos;
      },
    }),

    // Action: 切換 Todo 完成狀態
    toggleTodo: assign({
      todos: ({ context, event }) => {
        if (event.type !== 'TOGGLE_TODO') return context.todos;

        const updatedTodos = context.todos.map(todo =>
          todo.id === event.id ? { ...todo, completed: !todo.completed } : todo
        );
        saveTodosToStorage(updatedTodos);
        return updatedTodos;
      },
    }),

    // Action: 開始編輯
    startEdit: assign({
      editing: ({ event }) => {
        if (event.type !== 'START_EDIT') return null;
        return { id: event.id, text: event.text };
      },
    }),

    // Action: 更新 Todo
    updateTodo: assign({
      todos: ({ context, event }) => {
        if (event.type !== 'UPDATE_TODO') return context.todos;

        const updatedTodos = context.todos.map(todo =>
          todo.id === event.id ? { ...todo, text: event.text.trim() } : todo
        );
        saveTodosToStorage(updatedTodos);
        return updatedTodos;
      },
      editing: null,
    }),

    // Action: 取消編輯
    cancelEdit: assign({
      editing: null,
    }),

    // Action: 設置篩選器
    setFilter: assign({
      filter: ({ event }) => {
        if (event.type !== 'SET_FILTER') return 'all' as FilterType;
        return event.filter;
      },
    }),

    // Action: 清除已完成的 Todos
    clearCompleted: assign({
      todos: ({ context }) => {
        const updatedTodos = context.todos.filter(todo => !todo.completed);
        saveTodosToStorage(updatedTodos);
        return updatedTodos;
      },
    }),

    // Action: 加載成功
    loadSuccess: assign({
      todos: ({ event }) => {
        if (event.type !== 'LOAD_SUCCESS') return [];
        return event.todos;
      },
      error: null,
    }),

    // Action: 加載失敗
    loadFailure: assign({
      error: ({ event }) => {
        if (event.type !== 'LOAD_FAILURE') return null;
        return event.error;
      },
    }),
  },
}).createMachine({
  id: 'todoApp',
  initial: 'loading',
  context: {
    todos: [],
    filter: 'all',
    editing: null,
    error: null,
  },
  states: {
    // 加載狀態
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

    // 空閒狀態（主要狀態）
    idle: {
      on: {
        ADD_TODO: {
          guard: 'hasValidText',
          actions: 'addTodo',
        },
        DELETE_TODO: {
          actions: 'deleteTodo',
        },
        TOGGLE_TODO: {
          actions: 'toggleTodo',
        },
        START_EDIT: {
          target: 'editing',
          actions: 'startEdit',
        },
        SET_FILTER: {
          actions: 'setFilter',
        },
        CLEAR_COMPLETED: {
          guard: 'hasCompletedTodos',
          actions: 'clearCompleted',
        },
      },
    },

    // 編輯狀態
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
        DELETE_TODO: {
          target: 'idle',
          actions: ['deleteTodo', 'cancelEdit'],
        },
      },
    },
  },
});

// 導出類型
export type TodoMachine = typeof todoMachine;
export type TodoContext = typeof todoMachine.context;
export type TodoEvent = TodoEvent;
