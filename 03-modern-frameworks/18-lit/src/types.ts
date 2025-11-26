/**
 * Core Todo item interface
 */
export interface Todo {
  id: string;
  text: string;
  completed: boolean;
  createdAt: number;
}

/**
 * Filter types for displaying todos
 */
export type FilterType = 'all' | 'active' | 'completed';

/**
 * Custom event detail for todo actions
 */
export interface TodoEventDetail {
  id?: string;
  text?: string;
  completed?: boolean;
}

/**
 * Custom event detail for filter changes
 */
export interface FilterEventDetail {
  filter: FilterType;
}

/**
 * Storage interface for LocalStorage operations
 */
export interface TodoStorage {
  loadTodos(): Todo[];
  saveTodos(todos: Todo[]): void;
  clear(): void;
}

/**
 * Todo statistics for display
 */
export interface TodoStats {
  total: number;
  active: number;
  completed: number;
}

/**
 * Custom event names
 */
export const TodoEvents = {
  ADD: 'todo-add',
  TOGGLE: 'todo-toggle',
  DELETE: 'todo-delete',
  EDIT: 'todo-edit',
  CLEAR_COMPLETED: 'clear-completed',
  FILTER_CHANGE: 'filter-change',
} as const;

/**
 * LocalStorage key for todos
 */
export const STORAGE_KEY = 'lit-todos';
