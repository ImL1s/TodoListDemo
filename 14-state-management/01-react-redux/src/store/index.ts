import { configureStore } from '@reduxjs/toolkit'
import todosReducer from '../features/todos/todosSlice'

/**
 * Redux Store 配置
 *
 * 使用 Redux Toolkit 的 configureStore 來建立 store
 * 這個函數會自動配置：
 * 1. Redux DevTools Extension
 * 2. 開發環境的中間件檢查
 * 3. 預設的 thunk 中間件
 */
export const store = configureStore({
  reducer: {
    todos: todosReducer,
  },
})

// 從 store 本身推斷出 `RootState` 和 `AppDispatch` 類型
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
