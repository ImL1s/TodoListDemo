import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../../app/store';
import type { Todo, FilterType, TodosState } from '../../types/todo';

// LocalStorage 鍵名
const STORAGE_KEY = 'redux-toolkit-todos';

/**
 * 從 localStorage 載入 todos
 */
const loadTodosFromStorage = (): Todo[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Failed to load todos from localStorage:', error);
    return [];
  }
};

/**
 * 儲存 todos 到 localStorage
 */
const saveTodosToStorage = (todos: Todo[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
  } catch (error) {
    console.error('Failed to save todos to localStorage:', error);
  }
};

/**
 * 模擬非同步載入 todos（示範 createAsyncThunk 用法）
 */
export const loadTodos = createAsyncThunk(
  'todos/loadTodos',
  async () => {
    // 模擬 API 請求延遲
    await new Promise(resolve => setTimeout(resolve, 500));
    return loadTodosFromStorage();
  }
);

/**
 * 模擬非同步新增 todo（示範 createAsyncThunk 用法）
 */
export const addTodoAsync = createAsyncThunk(
  'todos/addTodoAsync',
  async (text: string) => {
    // 模擬 API 請求延遲
    await new Promise(resolve => setTimeout(resolve, 300));
    const newTodo: Todo = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      text,
      completed: false,
      createdAt: Date.now(),
    };
    return newTodo;
  }
);

// 初始狀態
const initialState: TodosState = {
  items: [],
  filter: 'all',
  editingId: null,
};

/**
 * Todos Slice
 * 使用 Redux Toolkit 的 createSlice 簡化 reducer 和 action 的創建
 */
const todosSlice = createSlice({
  name: 'todos',
  initialState,
  reducers: {
    /**
     * 新增 todo（同步版本）
     */
    addTodo: (state, action: PayloadAction<string>) => {
      const newTodo: Todo = {
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        text: action.payload,
        completed: false,
        createdAt: Date.now(),
      };
      state.items.push(newTodo);
      saveTodosToStorage(state.items);
    },

    /**
     * 切換 todo 的完成狀態
     */
    toggleTodo: (state, action: PayloadAction<string>) => {
      const todo = state.items.find(item => item.id === action.payload);
      if (todo) {
        todo.completed = !todo.completed;
        saveTodosToStorage(state.items);
      }
    },

    /**
     * 刪除 todo
     */
    deleteTodo: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(item => item.id !== action.payload);
      saveTodosToStorage(state.items);
    },

    /**
     * 開始編輯 todo
     */
    startEditing: (state, action: PayloadAction<string>) => {
      state.editingId = action.payload;
    },

    /**
     * 取消編輯
     */
    cancelEditing: (state) => {
      state.editingId = null;
    },

    /**
     * 更新 todo 文字
     */
    updateTodo: (state, action: PayloadAction<{ id: string; text: string }>) => {
      const todo = state.items.find(item => item.id === action.payload.id);
      if (todo) {
        todo.text = action.payload.text;
        saveTodosToStorage(state.items);
      }
      state.editingId = null;
    },

    /**
     * 設定篩選類型
     */
    setFilter: (state, action: PayloadAction<FilterType>) => {
      state.filter = action.payload;
    },

    /**
     * 清除所有已完成的 todos
     */
    clearCompleted: (state) => {
      state.items = state.items.filter(item => !item.completed);
      saveTodosToStorage(state.items);
    },

    /**
     * 標記所有為完成/未完成
     */
    toggleAll: (state, action: PayloadAction<boolean>) => {
      state.items.forEach(item => {
        item.completed = action.payload;
      });
      saveTodosToStorage(state.items);
    },
  },
  extraReducers: (builder) => {
    // 處理 loadTodos 的非同步狀態
    builder.addCase(loadTodos.fulfilled, (state, action) => {
      state.items = action.payload;
    });
    // 處理 addTodoAsync 的非同步狀態
    builder.addCase(addTodoAsync.fulfilled, (state, action) => {
      state.items.push(action.payload);
      saveTodosToStorage(state.items);
    });
  },
});

// 導出 actions
export const {
  addTodo,
  toggleTodo,
  deleteTodo,
  startEditing,
  cancelEditing,
  updateTodo,
  setFilter,
  clearCompleted,
  toggleAll,
} = todosSlice.actions;

// Selectors
/**
 * 獲取所有 todos
 */
export const selectAllTodos = (state: RootState) => state.todos.items;

/**
 * 獲取當前篩選類型
 */
export const selectFilter = (state: RootState) => state.todos.filter;

/**
 * 獲取編輯中的 todo ID
 */
export const selectEditingId = (state: RootState) => state.todos.editingId;

/**
 * 獲取已篩選的 todos（根據當前篩選類型）
 */
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

/**
 * 獲取統計資訊
 */
export const selectTodoStats = (state: RootState) => {
  const items = state.todos.items;
  return {
    total: items.length,
    active: items.filter(todo => !todo.completed).length,
    completed: items.filter(todo => todo.completed).length,
  };
};

// 導出 reducer
export default todosSlice.reducer;
