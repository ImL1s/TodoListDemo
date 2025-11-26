import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Todo, FilterType, TodoStore } from '@/types';

/**
 * Zustand store for managing todo state
 * Persists to localStorage automatically
 */
export const useTodoStore = create<TodoStore>()(
  persist(
    (set, get) => ({
      todos: [],
      filter: 'all',

      /**
       * Add a new todo item
       */
      addTodo: (text: string, priority?: Todo['priority']) => {
        const newTodo: Todo = {
          id: crypto.randomUUID(),
          text,
          completed: false,
          createdAt: Date.now(),
          priority,
        };
        set((state) => ({
          todos: [...state.todos, newTodo],
        }));
      },

      /**
       * Toggle todo completed status
       */
      toggleTodo: (id: string) => {
        set((state) => ({
          todos: state.todos.map((todo) =>
            todo.id === id ? { ...todo, completed: !todo.completed } : todo
          ),
        }));
      },

      /**
       * Delete a todo item
       */
      deleteTodo: (id: string) => {
        set((state) => ({
          todos: state.todos.filter((todo) => todo.id !== id),
        }));
      },

      /**
       * Edit todo text
       */
      editTodo: (id: string, text: string) => {
        set((state) => ({
          todos: state.todos.map((todo) =>
            todo.id === id ? { ...todo, text } : todo
          ),
        }));
      },

      /**
       * Set filter type
       */
      setFilter: (filter: FilterType) => {
        set({ filter });
      },

      /**
       * Clear all completed todos
       */
      clearCompleted: () => {
        set((state) => ({
          todos: state.todos.filter((todo) => !todo.completed),
        }));
      },

      /**
       * Get filtered todos based on current filter
       */
      filteredTodos: () => {
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
    }),
    {
      name: 'todo-storage',
    }
  )
);
