/**
 * Valtio Store for Todo List
 *
 * Demonstrates:
 * - proxy() for creating reactive state
 * - derive() for computed values
 * - Mutable-style updates with immutable behavior
 * - LocalStorage persistence with subscribe
 * - No boilerplate (no actions/reducers needed)
 */

import { proxy, subscribe, derive } from 'valtio';
import { devtools } from 'valtio/utils';
import type { Todo, TodoState, FilterType, TodoStats } from '../types';

// LocalStorage key
const STORAGE_KEY = 'valtio-todos';

// Load initial state from localStorage
const loadTodos = (): Todo[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Failed to load todos from localStorage:', error);
    return [];
  }
};

// Create the main state with proxy()
// proxy() wraps the object in a Proxy that tracks changes
// This allows mutable-style updates while maintaining immutability
export const todoState = proxy<TodoState>({
  todos: loadTodos(),
  filter: 'all',
});

// Derive computed values using derive()
// derive() creates a separate proxy with computed properties
// These values are automatically updated when dependencies change
export const todoStats = derive<TodoStats>(
  {
    // Computed: total number of todos
    total: (get) => get(todoState).todos.length,

    // Computed: number of active todos
    active: (get) => get(todoState).todos.filter(t => !t.completed).length,

    // Computed: number of completed todos
    completed: (get) => get(todoState).todos.filter(t => t.completed).length,
  },
  {
    proxy: todoState,
  }
);

/**
 * Actions for managing todos
 *
 * With Valtio, we don't need action creators or reducers.
 * We can directly mutate the state, and Valtio's proxy
 * will handle immutability and reactivity automatically.
 */

export const todoActions = {
  /**
   * Add a new todo
   * Direct mutation: we push to the array like normal JavaScript
   */
  addTodo: (text: string) => {
    const newTodo: Todo = {
      id: crypto.randomUUID(),
      text: text.trim(),
      completed: false,
      createdAt: Date.now(),
    };

    // Direct mutation - Valtio makes this immutable under the hood
    todoState.todos.push(newTodo);
  },

  /**
   * Toggle a todo's completed status
   * Direct mutation: we find and modify the object
   */
  toggleTodo: (id: string) => {
    const todo = todoState.todos.find(t => t.id === id);
    if (todo) {
      // Direct mutation - just flip the boolean
      todo.completed = !todo.completed;
    }
  },

  /**
   * Delete a todo
   * Direct mutation: we filter and reassign
   */
  deleteTodo: (id: string) => {
    // Direct mutation - reassign the array
    todoState.todos = todoState.todos.filter(t => t.id !== id);
  },

  /**
   * Edit a todo's text
   * Direct mutation: we find and modify
   */
  editTodo: (id: string, text: string) => {
    const todo = todoState.todos.find(t => t.id === id);
    if (todo) {
      // Direct mutation - reassign the property
      todo.text = text.trim();
    }
  },

  /**
   * Set the filter
   * Direct mutation: just assign the new value
   */
  setFilter: (filter: FilterType) => {
    todoState.filter = filter;
  },

  /**
   * Clear all completed todos
   * Direct mutation: filter and reassign
   */
  clearCompleted: () => {
    todoState.todos = todoState.todos.filter(t => !t.completed);
  },

  /**
   * Toggle all todos
   * Direct mutation: loop and modify each
   */
  toggleAll: (completed: boolean) => {
    // Direct mutation - modify each todo in place
    todoState.todos.forEach(todo => {
      todo.completed = completed;
    });
  },

  /**
   * Clear all todos (for testing)
   */
  clearAll: () => {
    todoState.todos = [];
  },
};

/**
 * Get filtered todos
 * This is a regular function, not a computed value
 * because it depends on the current filter state
 */
export const getFilteredTodos = (): Todo[] => {
  const { todos, filter } = todoState;

  switch (filter) {
    case 'active':
      return todos.filter(t => !t.completed);
    case 'completed':
      return todos.filter(t => t.completed);
    default:
      return todos;
  }
};

/**
 * Subscribe to state changes for localStorage persistence
 * subscribe() runs a callback whenever the state changes
 */
subscribe(todoState, () => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todoState.todos));
  } catch (error) {
    console.error('Failed to save todos to localStorage:', error);
  }
});

/**
 * Enable Redux DevTools integration (optional)
 * This allows debugging Valtio state in Redux DevTools browser extension
 */
if (process.env.NODE_ENV === 'development') {
  devtools(todoState, { name: 'Todo Store', enabled: true });
}
