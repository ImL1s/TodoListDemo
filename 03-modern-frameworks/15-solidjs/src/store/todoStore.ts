/**
 * SolidJS Todo Store
 *
 * This module demonstrates SolidJS's createStore for complex state management.
 * Unlike signals, stores allow nested reactivity and fine-grained updates to
 * object properties and array elements.
 *
 * Key concepts:
 * - createStore: Returns a readonly proxy and a setter function
 * - Fine-grained reactivity: Only affected components re-render
 * - Immutable updates: Use setter with path-based updates
 * - createEffect: Side effects that track reactive dependencies
 */

import { createStore } from 'solid-js/store';
import { createEffect } from 'solid-js';
import type { Todo, FilterType, TodoStore } from '../types';

const STORAGE_KEY = 'solidjs-todos';

/**
 * Load todos from localStorage
 * Returns empty array if no data or parsing fails
 */
function loadTodos(): Todo[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Failed to load todos from localStorage:', error);
    return [];
  }
}

/**
 * Create the global todo store
 *
 * createStore returns [state, setState] similar to React's useState,
 * but with fine-grained reactivity. The state is a readonly proxy that
 * tracks access, and setState allows granular updates.
 */
const [store, setStore] = createStore<TodoStore>({
  todos: loadTodos(),
  filter: 'all' as FilterType,
});

/**
 * Persist todos to localStorage whenever they change
 *
 * createEffect automatically tracks reactive dependencies.
 * This effect will re-run only when store.todos changes.
 */
createEffect(() => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(store.todos));
  } catch (error) {
    console.error('Failed to save todos to localStorage:', error);
  }
});

/**
 * Todo Store Actions
 *
 * These functions use the setter to update the store.
 * SolidJS's fine-grained reactivity ensures only affected
 * components re-render when state changes.
 */

export function addTodo(text: string): void {
  const trimmedText = text.trim();
  if (!trimmedText) return;

  const newTodo: Todo = {
    id: crypto.randomUUID(),
    text: trimmedText,
    completed: false,
    createdAt: Date.now(),
  };

  // Add to the beginning of the array
  // This uses the functional form of setState
  setStore('todos', (todos) => [newTodo, ...todos]);
}

export function toggleTodo(id: string): void {
  // Path-based update: Only the specific todo's completed property updates
  // This is much more efficient than updating the entire array
  setStore(
    'todos',
    (todo) => todo.id === id,
    'completed',
    (completed) => !completed
  );
}

export function deleteTodo(id: string): void {
  // Filter out the todo with the matching id
  setStore('todos', (todos) => todos.filter((todo) => todo.id !== id));
}

export function editTodo(id: string, text: string): void {
  const trimmedText = text.trim();
  if (!trimmedText) {
    deleteTodo(id);
    return;
  }

  // Path-based update for the text property
  setStore('todos', (todo) => todo.id === id, 'text', trimmedText);
}

export function clearCompleted(): void {
  setStore('todos', (todos) => todos.filter((todo) => !todo.completed));
}

export function toggleAll(): void {
  const allCompleted = store.todos.length > 0 && store.todos.every((todo) => todo.completed);

  // Update all todos' completed status
  // This uses the batch update pattern
  setStore('todos', {}, 'completed', !allCompleted);
}

export function setFilter(filter: FilterType): void {
  setStore('filter', filter);
}

/**
 * Computed values (getters)
 *
 * These are plain functions that access the store.
 * When used in components, they automatically track dependencies
 * and re-run only when accessed values change.
 */

export function getFilteredTodos(): Todo[] {
  switch (store.filter) {
    case 'active':
      return store.todos.filter((todo) => !todo.completed);
    case 'completed':
      return store.todos.filter((todo) => todo.completed);
    default:
      return store.todos;
  }
}

export function getActiveCount(): number {
  return store.todos.filter((todo) => !todo.completed).length;
}

export function getCompletedCount(): number {
  return store.todos.filter((todo) => todo.completed).length;
}

export function hasCompletedTodos(): boolean {
  return store.todos.some((todo) => todo.completed);
}

export function allCompleted(): boolean {
  return store.todos.length > 0 && store.todos.every((todo) => todo.completed);
}

// Export the store for read-only access
export { store };
