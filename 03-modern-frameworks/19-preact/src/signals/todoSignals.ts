import { signal, computed } from '@preact/signals';
import type { Todo, FilterType } from '../types';

/**
 * LocalStorage key for persisting todos
 */
const STORAGE_KEY = 'preact-todos';

/**
 * Load todos from localStorage
 */
const loadTodosFromStorage = (): Todo[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Failed to load todos from localStorage:', error);
  }
  return [];
};

/**
 * Save todos to localStorage
 */
const saveTodosToStorage = (todos: Todo[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
  } catch (error) {
    console.error('Failed to save todos to localStorage:', error);
  }
};

/**
 * Generate unique ID for new todos
 */
const generateId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

// ============================================================================
// SIGNALS - Core reactive state
// ============================================================================

/**
 * Signal containing all todos
 * This is the single source of truth for todo data
 */
export const todosSignal = signal<Todo[]>(loadTodosFromStorage());

/**
 * Signal for the current filter
 */
export const filterSignal = signal<FilterType>('all');

// ============================================================================
// COMPUTED SIGNALS - Derived reactive state
// ============================================================================

/**
 * Computed signal for filtered todos based on current filter
 * Automatically updates when todosSignal or filterSignal changes
 */
export const filteredTodosSignal = computed<Todo[]>(() => {
  const todos = todosSignal.value;
  const filter = filterSignal.value;

  switch (filter) {
    case 'active':
      return todos.filter((todo) => !todo.completed);
    case 'completed':
      return todos.filter((todo) => todo.completed);
    default:
      return todos;
  }
});

/**
 * Computed signal for the count of active (incomplete) todos
 */
export const activeTodoCountSignal = computed<number>(() => {
  return todosSignal.value.filter((todo) => !todo.completed).length;
});

/**
 * Computed signal for the count of completed todos
 */
export const completedTodoCountSignal = computed<number>(() => {
  return todosSignal.value.filter((todo) => todo.completed).length;
});

/**
 * Computed signal for the total count of todos
 */
export const totalTodoCountSignal = computed<number>(() => {
  return todosSignal.value.length;
});

// ============================================================================
// ACTIONS - Functions to modify state
// ============================================================================

/**
 * Add a new todo
 */
export const addTodo = (text: string): void => {
  if (!text.trim()) return;

  const newTodo: Todo = {
    id: generateId(),
    text: text.trim(),
    completed: false,
    createdAt: Date.now(),
  };

  // Update the signal value immutably
  todosSignal.value = [newTodo, ...todosSignal.value];

  // Persist to localStorage
  saveTodosToStorage(todosSignal.value);
};

/**
 * Toggle the completed status of a todo
 */
export const toggleTodo = (id: string): void => {
  todosSignal.value = todosSignal.value.map((todo) =>
    todo.id === id ? { ...todo, completed: !todo.completed } : todo
  );

  // Persist to localStorage
  saveTodosToStorage(todosSignal.value);
};

/**
 * Delete a todo
 */
export const deleteTodo = (id: string): void => {
  todosSignal.value = todosSignal.value.filter((todo) => todo.id !== id);

  // Persist to localStorage
  saveTodosToStorage(todosSignal.value);
};

/**
 * Set the current filter
 */
export const setFilter = (filter: FilterType): void => {
  filterSignal.value = filter;
};

/**
 * Clear all completed todos
 */
export const clearCompleted = (): void => {
  todosSignal.value = todosSignal.value.filter((todo) => !todo.completed);

  // Persist to localStorage
  saveTodosToStorage(todosSignal.value);
};

/**
 * Clear all todos
 */
export const clearAllTodos = (): void => {
  todosSignal.value = [];

  // Persist to localStorage
  saveTodosToStorage(todosSignal.value);
};
