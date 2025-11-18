import { create } from 'zustand';
import { persist, createJSONStorage, devtools } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
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
 * Zustand Store - 極簡狀態管理，展示所有最佳實踐
 *
 * Zustand 特色：
 * 1. 無需 Provider - 直接使用 hook
 * 2. 極簡 API - create 函數即可創建 store
 * 3. TypeScript 友好 - 完整的類型推斷
 * 4. 內置 middleware - persist、devtools、immer 等
 * 5. 性能優秀 - 自動優化重渲染
 *
 * 與 Redux 對比：
 * - 無需 reducer、action、dispatch
 * - 無需 Provider 包裝
 * - 代碼量少 80%
 * - 學習曲線平緩
 *
 * Middleware 組合順序說明：
 * - devtools 在最外層：提供 Redux DevTools 支持
 * - persist 在中間層：自動持久化到 localStorage
 * - immer 在最內層：簡化不可變數據操作
 */
export const useTodoStore = create<TodoStore>()(
  // devtools middleware：Redux DevTools 支持
  devtools(
    // persist middleware：自動持久化到 localStorage
    persist(
      // immer middleware：使用 Immer 簡化不可變數據操作
      immer((set, get) => ({
        // 初始狀態
        todos: [],
        filter: 'all',

        // 添加待辦事項
        // 使用 immer：可以直接修改 draft state
        addTodo: (text: string) => {
          const newTodo: Todo = {
            id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            text,
            completed: false,
            createdAt: Date.now()
          };

          // immer 方式：直接 unshift（修改 draft state）
          set((state) => {
            state.todos.unshift(newTodo);
          });
        },

        // 切換待辦事項完成狀態
        // 使用 immer：直接修改找到的 todo
        toggleTodo: (id: string) => {
          set((state) => {
            const todo = state.todos.find((t) => t.id === id);
            if (todo) {
              todo.completed = !todo.completed;
              todo.completedAt = todo.completed ? Date.now() : undefined;
            }
          });
        },

        // 刪除待辦事項
        // 使用 immer：直接 splice 刪除
        deleteTodo: (id: string) => {
          set((state) => {
            const index = state.todos.findIndex((t) => t.id === id);
            if (index !== -1) {
              state.todos.splice(index, 1);
            }
          });
        },

        // 編輯待辦事項
        // 使用 immer：直接修改屬性
        editTodo: (id: string, newText: string) => {
          set((state) => {
            const todo = state.todos.find((t) => t.id === id);
            if (todo) {
              todo.text = newText;
            }
          });
        },

        // 清除所有已完成的待辦事項
        // 使用 immer：直接賦值新數組
        clearCompleted: () => {
          set((state) => {
            state.todos = state.todos.filter((todo) => !todo.completed);
          });
        },

        // 設置篩選器
        setFilter: (filter: FilterType) => {
          set((state) => {
            state.filter = filter;
          });
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
      })),
      {
        name: 'zustand-todos', // localStorage 的 key
        storage: createJSONStorage(() => localStorage), // 使用 localStorage
      }
    ),
    { name: 'TodoStore' } // devtools 中顯示的名稱
  )
);

/**
 * 使用示例：
 *
 * // 在組件中使用整個 store
 * const { todos, addTodo, toggleTodo } = useTodoStore();
 *
 * // 只訂閱特定狀態（性能優化 - 推薦）
 * const todos = useTodoStore((state) => state.todos);
 * const addTodo = useTodoStore((state) => state.addTodo);
 *
 * // 使用選擇器
 * const filteredTodos = useTodoStore((state) => state.getFilteredTodos());
 * const stats = useTodoStore((state) => state.getStats());
 */

/**
 * Middleware 組合說明：
 *
 * 1. devtools - Redux DevTools 支持
 *    - 在瀏覽器中使用 Redux DevTools 查看狀態變化
 *    - 可以時間旅行調試
 *    - 查看每個 action 的詳細信息
 *
 * 2. persist - 持久化
 *    - 自動保存狀態到 localStorage
 *    - 頁面刷新後自動恢復狀態
 *    - 支持自定義序列化和反序列化
 *
 * 3. immer - 不可變數據簡化
 *    - 可以直接修改 draft state，immer 自動處理不可變性
 *    - 代碼更簡潔，更接近原生 JavaScript
 *    - 性能優秀，自動優化
 *
 * Immer 優勢對比：
 *
 * 傳統方式（不使用 immer）：
 * set((state) => ({
 *   todos: state.todos.map((todo) =>
 *     todo.id === id
 *       ? { ...todo, completed: !todo.completed }
 *       : todo
 *   )
 * }));
 *
 * 使用 immer：
 * set((state) => {
 *   const todo = state.todos.find((t) => t.id === id);
 *   if (todo) {
 *     todo.completed = !todo.completed;
 *   }
 * });
 *
 * 更簡潔、更直觀！
 */
