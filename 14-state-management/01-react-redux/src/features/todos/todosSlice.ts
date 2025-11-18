import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '../../store'

/**
 * Todo 項目的類型定義
 */
export interface Todo {
  id: string
  text: string
  completed: boolean
  createdAt: number
}

/**
 * 過濾器類型
 */
export type FilterType = 'all' | 'active' | 'completed'

/**
 * Todos State 的類型定義
 */
interface TodosState {
  items: Todo[]
  filter: FilterType
}

/**
 * 初始狀態
 * 嘗試從 localStorage 載入資料，如果沒有則使用預設值
 */
const loadFromLocalStorage = (): Todo[] => {
  try {
    const savedTodos = localStorage.getItem('redux-todos')
    return savedTodos ? JSON.parse(savedTodos) : []
  } catch (error) {
    console.error('Failed to load todos from localStorage:', error)
    return []
  }
}

const initialState: TodosState = {
  items: loadFromLocalStorage(),
  filter: 'all',
}

/**
 * Todos Slice
 *
 * createSlice 是 Redux Toolkit 的核心 API
 * 它會自動生成 action creators 和 action types
 *
 * 優點：
 * 1. 減少樣板代碼
 * 2. 使用 Immer 允許直接「修改」狀態
 * 3. 自動生成 action creators
 */
const todosSlice = createSlice({
  name: 'todos',
  initialState,
  reducers: {
    /**
     * 新增 Todo
     */
    addTodo: (state, action: PayloadAction<string>) => {
      const newTodo: Todo = {
        id: Date.now().toString(),
        text: action.payload,
        completed: false,
        createdAt: Date.now(),
      }
      state.items.push(newTodo)
      saveToLocalStorage(state.items)
    },

    /**
     * 切換 Todo 的完成狀態
     */
    toggleTodo: (state, action: PayloadAction<string>) => {
      const todo = state.items.find(item => item.id === action.payload)
      if (todo) {
        todo.completed = !todo.completed
        saveToLocalStorage(state.items)
      }
    },

    /**
     * 刪除 Todo
     */
    deleteTodo: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(item => item.id !== action.payload)
      saveToLocalStorage(state.items)
    },

    /**
     * 編輯 Todo 文字
     */
    editTodo: (state, action: PayloadAction<{ id: string; text: string }>) => {
      const todo = state.items.find(item => item.id === action.payload.id)
      if (todo) {
        todo.text = action.payload.text
        saveToLocalStorage(state.items)
      }
    },

    /**
     * 切換全部 Todo 的完成狀態
     */
    toggleAllTodos: (state, action: PayloadAction<boolean>) => {
      state.items.forEach(todo => {
        todo.completed = action.payload
      })
      saveToLocalStorage(state.items)
    },

    /**
     * 清除已完成的 Todos
     */
    clearCompleted: (state) => {
      state.items = state.items.filter(item => !item.completed)
      saveToLocalStorage(state.items)
    },

    /**
     * 設定過濾器
     */
    setFilter: (state, action: PayloadAction<FilterType>) => {
      state.filter = action.payload
    },
  },
})

/**
 * 儲存到 localStorage
 */
const saveToLocalStorage = (todos: Todo[]) => {
  try {
    localStorage.setItem('redux-todos', JSON.stringify(todos))
  } catch (error) {
    console.error('Failed to save todos to localStorage:', error)
  }
}

// 匯出 actions
export const {
  addTodo,
  toggleTodo,
  deleteTodo,
  editTodo,
  toggleAllTodos,
  clearCompleted,
  setFilter,
} = todosSlice.actions

/**
 * Selectors
 * 用於從 state 中選取資料
 */

// 選取所有 todos
export const selectAllTodos = (state: RootState) => state.todos.items

// 選取當前過濾器
export const selectFilter = (state: RootState) => state.todos.filter

// 選取已過濾的 todos
export const selectFilteredTodos = (state: RootState) => {
  const { items, filter } = state.todos

  switch (filter) {
    case 'active':
      return items.filter(todo => !todo.completed)
    case 'completed':
      return items.filter(todo => todo.completed)
    default:
      return items
  }
}

// 選取統計資料
export const selectTodoStats = (state: RootState) => {
  const todos = state.todos.items
  return {
    total: todos.length,
    active: todos.filter(todo => !todo.completed).length,
    completed: todos.filter(todo => todo.completed).length,
  }
}

// 匯出 reducer
export default todosSlice.reducer
