import { create } from 'zustand';
import { persist, createJSONStorage, devtools } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import type { Todo, FilterType, TodoStats } from '../types';

/**
 * Slice Pattern 示例 - 適用於大型應用
 *
 * 這個文件展示了如何使用 Slice Pattern 來組織 Zustand Store
 * Slice Pattern 允許你將大型 store 拆分成多個小的、可管理的部分
 *
 * 優勢：
 * 1. 代碼組織更清晰
 * 2. 每個 slice 負責自己的邏輯
 * 3. 更容易測試和維護
 * 4. 適合大型應用
 */

// ============================================
// Slice 1: Todos Slice (待辦事項管理)
// ============================================
interface TodosSlice {
  todos: Todo[];
  addTodo: (text: string) => void;
  toggleTodo: (id: string) => void;
  deleteTodo: (id: string) => void;
  editTodo: (id: string, newText: string) => void;
  clearCompleted: () => void;
}

const createTodosSlice = (
  set: any,
  _get: any
): TodosSlice => ({
  todos: [],

  addTodo: (text: string) => {
    const newTodo: Todo = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      text,
      completed: false,
      createdAt: Date.now()
    };

    set((state: any) => {
      state.todos.unshift(newTodo);
    });
  },

  toggleTodo: (id: string) => {
    set((state: any) => {
      const todo = state.todos.find((t: Todo) => t.id === id);
      if (todo) {
        todo.completed = !todo.completed;
        todo.completedAt = todo.completed ? Date.now() : undefined;
      }
    });
  },

  deleteTodo: (id: string) => {
    set((state: any) => {
      const index = state.todos.findIndex((t: Todo) => t.id === id);
      if (index !== -1) {
        state.todos.splice(index, 1);
      }
    });
  },

  editTodo: (id: string, newText: string) => {
    set((state: any) => {
      const todo = state.todos.find((t: Todo) => t.id === id);
      if (todo) {
        todo.text = newText;
      }
    });
  },

  clearCompleted: () => {
    set((state: any) => {
      state.todos = state.todos.filter((todo: Todo) => !todo.completed);
    });
  }
});

// ============================================
// Slice 2: Filter Slice (篩選器管理)
// ============================================
interface FilterSlice {
  filter: FilterType;
  setFilter: (filter: FilterType) => void;
}

const createFilterSlice = (
  set: any,
  _get: any
): FilterSlice => ({
  filter: 'all',

  setFilter: (filter: FilterType) => {
    set((state: any) => {
      state.filter = filter;
    });
  }
});

// ============================================
// Slice 3: Selectors Slice (選擇器/計算屬性)
// ============================================
interface SelectorsSlice {
  getFilteredTodos: () => Todo[];
  getStats: () => TodoStats;
}

const createSelectorsSlice = (
  _set: any,
  get: any
): SelectorsSlice => ({
  getFilteredTodos: () => {
    const { todos, filter } = get();
    switch (filter) {
      case 'active':
        return todos.filter((todo: Todo) => !todo.completed);
      case 'completed':
        return todos.filter((todo: Todo) => todo.completed);
      default:
        return todos;
    }
  },

  getStats: () => {
    const todos = get().todos;
    return {
      total: todos.length,
      active: todos.filter((todo: Todo) => !todo.completed).length,
      completed: todos.filter((todo: Todo) => todo.completed).length
    };
  }
});

// ============================================
// 組合所有 Slices
// ============================================
type TodoStore = TodosSlice & FilterSlice & SelectorsSlice;

/**
 * 使用 Slice Pattern 創建 Store
 *
 * 注意：每個 slice 都是獨立的函數，返回自己的狀態和方法
 * 最後通過展開運算符組合所有 slice
 */
export const useTodoStoreWithSlices = create<TodoStore>()(
  devtools(
    persist(
      immer((set, get) => ({
        // 組合所有 slices
        ...createTodosSlice(set, get),
        ...createFilterSlice(set, get),
        ...createSelectorsSlice(set, get)
      })),
      {
        name: 'zustand-todos-slices',
        storage: createJSONStorage(() => localStorage),
      }
    ),
    { name: 'TodoStoreWithSlices' }
  )
);

/**
 * Slice Pattern 使用場景：
 *
 * ✅ 適合使用 Slice Pattern 的情況：
 * 1. 大型應用，store 有很多狀態和方法
 * 2. 需要將不同的功能邏輯分開
 * 3. 多人協作，不同人負責不同的 slice
 * 4. 需要更好的代碼組織和可維護性
 *
 * ❌ 不需要使用 Slice Pattern 的情況：
 * 1. 小型應用，狀態簡單
 * 2. Store 只有幾個狀態和方法
 * 3. 單人開發，代碼量不大
 *
 * 本例中，因為是簡單的 Todo 應用，
 * 其實不需要使用 Slice Pattern，
 * 這裡只是作為示例展示如何使用。
 */

/**
 * Slice Pattern vs 單一 Store 對比：
 *
 * 單一 Store (適合小型應用):
 * create((set, get) => ({
 *   todos: [],
 *   filter: 'all',
 *   addTodo: (text) => { ... },
 *   setFilter: (filter) => { ... },
 *   // 所有方法都在一起
 * }))
 *
 * Slice Pattern (適合大型應用):
 * create((set, get) => ({
 *   ...createTodosSlice(set, get),    // 待辦事項邏輯
 *   ...createFilterSlice(set, get),   // 篩選器邏輯
 *   ...createSelectorsSlice(set, get) // 選擇器邏輯
 *   // 邏輯分離，易於維護
 * }))
 */

/**
 * 進階：Slice 之間的通信
 *
 * 有時候一個 slice 需要訪問另一個 slice 的狀態或方法
 * 可以通過 get() 函數訪問：
 *
 * const createUISlice = (set, get) => ({
 *   showCompleted: true,
 *
 *   toggleShowCompleted: () => {
 *     set((state) => {
 *       state.showCompleted = !state.showCompleted;
 *     });
 *
 *     // 訪問其他 slice 的方法
 *     const filter = get().showCompleted ? 'completed' : 'all';
 *     get().setFilter(filter);
 *   }
 * });
 */
