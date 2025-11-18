import { configureStore } from '@reduxjs/toolkit';
import todosReducer from '../features/todos/todosSlice';

/**
 * Redux Store 配置
 * 使用 Redux Toolkit 的 configureStore 自動設置：
 * - Redux DevTools Extension
 * - redux-thunk middleware
 * - 開發環境下的序列化檢查和不可變性檢查
 */
export const store = configureStore({
  reducer: {
    todos: todosReducer,
  },
  // 可以在這裡添加額外的 middleware
  // middleware: (getDefaultMiddleware) =>
  //   getDefaultMiddleware().concat(logger),
});

// 從 store 本身推斷 RootState 和 AppDispatch 類型
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
