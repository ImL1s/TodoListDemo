/**
 * Core Todo item type
 */
export interface Todo {
  id: string;
  text: string;
  completed: boolean;
  createdAt: number;
  updatedAt: number;
  priority?: 'low' | 'medium' | 'high';
  category?: string;
}

/**
 * Filter options for displaying todos
 */
export type FilterType = 'all' | 'active' | 'completed';

/**
 * Statistics about the todo list
 */
export interface TodoStats {
  total: number;
  completed: number;
  active: number;
  completionRate: number;
}

/**
 * Sort options for the todo list
 */
export type SortType = 'createdAt' | 'priority' | 'text';

/**
 * Sort direction
 */
export type SortDirection = 'asc' | 'desc';
