/**
 * Type Definitions for Todo Application
 *
 * Stencil is built on TypeScript, providing excellent type safety
 * and IDE support for web component development.
 */

export interface Todo {
  id: string;
  text: string;
  completed: boolean;
  createdAt: number;
}

export type FilterType = 'all' | 'active' | 'completed';

export interface TodoStats {
  total: number;
  active: number;
  completed: number;
}
