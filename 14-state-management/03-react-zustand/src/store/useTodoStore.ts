import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { Todo, FilterType, TodoStats } from '../types';

/**
 * Zustand Store 的狀態和方法接口
 * 這是 Zustand 的核心優勢之一：清晰的類型定義
 */
interface TodoStore {
  // 狀態
  todos: Todo[];
  filter: FilterType;

  // 操作方法
  addTodo: (text: string) => void;
  toggleTodo: (id: string) => void;
  deleteTodo: (id: string) => void;
  editTodo: (id: string, newText: string) => void;
  clearCompleted: () => void;
  setFilter: (filter: FilterType) => void;

  // 計算屬性（選擇器）
  getFilteredTodos: () => Todo[];
  getStats: () => TodoStats;
}

/**
 * Zustand Store - 極簡狀態管理
 *
 * Zustand 特色：
 * 1. 無需 Provider - 直接使用 hook
 * 2. 極簡 API - create 函數即可創建 store
 * 3. TypeScript 友好 - 完整的類型推斷
 * 4. 內置 middleware - persist、devtools 等
 * 5. 性能優秀 - 自動優化重渲染
 *
 * 與 Redux 對比：
 * - 無需 reducer、action、dispatch
 * - 無需 Provider 包裝
 * - 代碼量少 80%
 * - 學習曲線平緩
 */
export const useTodoStore = create<TodoStore>()(
  // persist middleware：自動持久化到 localStorage
  persist(
    (set, get) => ({
      // 初始狀態
      todos: [],
      filter: 'all',

      // 添加待辦事項
      addTodo: (text: string) => {
        const newTodo: Todo = {
          id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          text,
          completed: false,
          createdAt: Date.now()
        };

        // Zustand 的 set 函數：簡單直觀的狀態更新
        set((state) => ({
          todos: [newTodo, ...state.todos]
        }));
      },

      // 切換待辦事項完成狀態
      toggleTodo: (id: string) => {
        set((state) => ({
          todos: state.todos.map((todo) =>
            todo.id === id
              ? {
                  ...todo,
                  completed: !todo.completed,
                  completedAt: !todo.completed ? Date.now() : undefined
                }
              : todo
          )
        }));
      },

      // 刪除待辦事項
      deleteTodo: (id: string) => {
        set((state) => ({
          todos: state.todos.filter((todo) => todo.id !== id)
        }));
      },

      // 編輯待辦事項
      editTodo: (id: string, newText: string) => {
        set((state) => ({
          todos: state.todos.map((todo) =>
            todo.id === id ? { ...todo, text: newText } : todo
          )
        }));
      },

      // 清除所有已完成的待辦事項
      clearCompleted: () => {
        set((state) => ({
          todos: state.todos.filter((todo) => !todo.completed)
        }));
      },

      // 設置篩選器
      setFilter: (filter: FilterType) => {
        set({ filter });
      },

      // 獲取過濾後的待辦事項
      // Zustand 的選擇器：在組件中可以訂閱特定的派生狀態
      getFilteredTodos: () => {
        const { todos, filter } = get();
        switch (filter) {
          case 'active':
            return todos.filter((todo) => !todo.completed);
          case 'completed':
            return todos.filter((todo) => todo.completed);
          default:
            return todos;
        }
      },

      // 獲取統計數據
      getStats: () => {
        const todos = get().todos;
        return {
          total: todos.length,
          active: todos.filter((todo) => !todo.completed).length,
          completed: todos.filter((todo) => todo.completed).length
        };
      }
    }),
    {
      name: 'zustand-todos', // localStorage 的 key
      storage: createJSONStorage(() => localStorage), // 使用 localStorage
    }
  )
);

/**
 * 使用示例：
 *
 * // 在組件中使用整個 store
 * const { todos, addTodo, toggleTodo } = useTodoStore();
 *
 * // 只訂閱特定狀態（性能優化）
 * const todos = useTodoStore((state) => state.todos);
 * const addTodo = useTodoStore((state) => state.addTodo);
 *
 * // 使用選擇器
 * const filteredTodos = useTodoStore((state) => state.getFilteredTodos());
 * const stats = useTodoStore((state) => state.getStats());
 */
