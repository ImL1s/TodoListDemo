/**
 * Core types for Qwik Todo List Application
 *
 * These types are used throughout the application to ensure type safety
 * and provide excellent IDE autocomplete support.
 */

/**
 * Represents a single todo item
 */
export interface Todo {
  /** Unique identifier for the todo */
  id: string;

  /** The text content of the todo */
  text: string;

  /** Whether the todo is completed */
  completed: boolean;

  /** Timestamp when the todo was created */
  createdAt: number;
}

/**
 * Filter options for displaying todos
 */
export type FilterType = 'all' | 'active' | 'completed';

/**
 * Todo store state
 *
 * In Qwik, we use useStore to create reactive state.
 * This interface defines the shape of our main todo state.
 */
export interface TodoStore {
  /** Array of all todos */
  todos: Todo[];

  /** Current filter selection */
  filter: FilterType;

  /** ID of the todo being edited (null if none) */
  editingId: string | null;
}

/**
 * Statistics derived from todo list
 */
export interface TodoStats {
  /** Total number of todos */
  total: number;

  /** Number of active (incomplete) todos */
  active: number;

  /** Number of completed todos */
  completed: number;

  /** Percentage of completed todos */
  completionRate: number;
}

/**
 * LocalStorage key for persisting todos
 */
export const STORAGE_KEY = 'qwik-todos';

/**
 * Helper function to generate unique IDs
 */
export const generateId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Helper function to create a new todo
 */
export const createTodo = (text: string): Todo => {
  return {
    id: generateId(),
    text: text.trim(),
    completed: false,
    createdAt: Date.now(),
  };
};

/**
 * Helper function to filter todos based on filter type
 */
export const filterTodos = (todos: Todo[], filter: FilterType): Todo[] => {
  switch (filter) {
    case 'active':
      return todos.filter(todo => !todo.completed);
    case 'completed':
      return todos.filter(todo => todo.completed);
    default:
      return todos;
  }
};

/**
 * Helper function to calculate todo statistics
 */
export const calculateStats = (todos: Todo[]): TodoStats => {
  const total = todos.length;
  const completed = todos.filter(todo => todo.completed).length;
  const active = total - completed;
  const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

  return {
    total,
    active,
    completed,
    completionRate,
  };
};
