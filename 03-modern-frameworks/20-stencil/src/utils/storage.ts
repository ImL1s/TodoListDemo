/**
 * LocalStorage Utility Functions
 *
 * Stencil components can use standard JavaScript utilities.
 * This demonstrates how to handle persistence in Stencil apps.
 */

import { Todo } from './types';

const STORAGE_KEY = 'stencil-todos';

/**
 * Load todos from localStorage
 */
export function loadTodos(): Todo[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Error loading todos from localStorage:', error);
  }
  return [];
}

/**
 * Save todos to localStorage
 */
export function saveTodos(todos: Todo[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
  } catch (error) {
    console.error('Error saving todos to localStorage:', error);
  }
}

/**
 * Generate unique ID for todos
 */
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}
