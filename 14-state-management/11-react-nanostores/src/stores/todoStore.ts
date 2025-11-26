/**
 * Nanostores Todo Store
 *
 * This file demonstrates all major Nanostores features:
 * 1. atom() - Simple reactive values
 * 2. map() - Reactive objects/collections
 * 3. computed() - Derived state
 * 4. persistentAtom() - LocalStorage persistence
 * 5. Action creators - Encapsulated state updates
 */

import { atom, computed } from 'nanostores';
import { persistentAtom } from '@nanostores/persistent';
import type { Todo, FilterType, TodoStats } from '../types';

// ============================================================================
// 1. ATOM STORES - For simple values
// ============================================================================

/**
 * Current filter - Using persistentAtom for localStorage persistence
 * This demonstrates Nanostores' built-in localStorage support
 */
export const $filter = persistentAtom<FilterType>('todoFilter', 'all', {
  encode: JSON.stringify,
  decode: JSON.parse,
});

/**
 * Editing todo ID - Regular atom for transient state
 * null when not editing
 */
export const $editingId = atom<string | null>(null);

// ============================================================================
// 2. MAP STORES - For complex objects/collections
// ============================================================================

/**
 * Todos map store - Using persistentAtom with map-like structure
 * Key: todo.id, Value: Todo object
 *
 * Note: We use persistentAtom instead of persistentMap for better TypeScript support
 */
export const $todos = persistentAtom<Record<string, Todo>>('todos', {}, {
  encode: JSON.stringify,
  decode: JSON.parse,
});

// ============================================================================
// 3. COMPUTED STORES - For derived state
// ============================================================================

/**
 * Filtered todos - Automatically recalculates when $todos or $filter changes
 * This demonstrates Nanostores' efficient reactivity system
 */
export const $filteredTodos = computed(
  [$todos, $filter],
  (todos, filter) => {
    const todoArray = Object.values(todos);

    switch (filter) {
      case 'active':
        return todoArray.filter(todo => !todo.completed);
      case 'completed':
        return todoArray.filter(todo => todo.completed);
      default:
        return todoArray;
    }
  }
);

/**
 * Todo statistics - Computed from $todos
 * Demonstrates how computed stores can derive complex data
 */
export const $stats = computed($todos, (todos): TodoStats => {
  const todoArray = Object.values(todos);
  return {
    total: todoArray.length,
    active: todoArray.filter(todo => !todo.completed).length,
    completed: todoArray.filter(todo => todo.completed).length,
  };
});

/**
 * Sorted filtered todos - Nested computed store
 * Shows how computed stores can depend on other computed stores
 */
export const $sortedFilteredTodos = computed($filteredTodos, (todos) => {
  return [...todos].sort((a, b) => b.createdAt - a.createdAt);
});

// ============================================================================
// 4. ACTION CREATORS - Encapsulated state updates
// ============================================================================

/**
 * Add a new todo
 * Action creators provide a clean API and encapsulate business logic
 */
export function addTodo(text: string): void {
  const trimmedText = text.trim();
  if (!trimmedText) return;

  const newTodo: Todo = {
    id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
    text: trimmedText,
    completed: false,
    createdAt: Date.now(),
  };

  // Update the map store
  $todos.set({
    ...$todos.get(),
    [newTodo.id]: newTodo,
  });
}

/**
 * Toggle todo completion status
 */
export function toggleTodo(id: string): void {
  const todos = $todos.get();
  const todo = todos[id];

  if (!todo) return;

  $todos.set({
    ...todos,
    [id]: { ...todo, completed: !todo.completed },
  });
}

/**
 * Delete a todo
 */
export function deleteTodo(id: string): void {
  const todos = $todos.get();
  const { [id]: _, ...rest } = todos;
  $todos.set(rest);
}

/**
 * Update todo text
 */
export function updateTodo(id: string, text: string): void {
  const trimmedText = text.trim();
  if (!trimmedText) return;

  const todos = $todos.get();
  const todo = todos[id];

  if (!todo) return;

  $todos.set({
    ...todos,
    [id]: { ...todo, text: trimmedText },
  });
}

/**
 * Clear all completed todos
 */
export function clearCompleted(): void {
  const todos = $todos.get();
  const activeTodos = Object.entries(todos).reduce(
    (acc, [id, todo]) => {
      if (!todo.completed) {
        acc[id] = todo;
      }
      return acc;
    },
    {} as Record<string, Todo>
  );

  $todos.set(activeTodos);
}

/**
 * Toggle all todos
 */
export function toggleAll(): void {
  const todos = $todos.get();
  const stats = $stats.get();
  const shouldComplete = stats.active > 0;

  const updatedTodos = Object.entries(todos).reduce(
    (acc, [id, todo]) => {
      acc[id] = { ...todo, completed: shouldComplete };
      return acc;
    },
    {} as Record<string, Todo>
  );

  $todos.set(updatedTodos);
}

/**
 * Set current filter
 */
export function setFilter(filter: FilterType): void {
  $filter.set(filter);
}

/**
 * Set editing todo ID
 */
export function setEditingId(id: string | null): void {
  $editingId.set(id);
}

// ============================================================================
// 5. UTILITY FUNCTIONS
// ============================================================================

/**
 * Get current todos as array (for non-reactive access)
 */
export function getTodosArray(): Todo[] {
  return Object.values($todos.get());
}

/**
 * Check if any todos exist
 */
export function hasTodos(): boolean {
  return Object.keys($todos.get()).length > 0;
}
