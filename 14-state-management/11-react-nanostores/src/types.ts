/**
 * Todo item type definition
 */
export interface Todo {
  id: string;
  text: string;
  completed: boolean;
  createdAt: number;
}

/**
 * Filter type for todo list
 */
export type FilterType = 'all' | 'active' | 'completed';

/**
 * Statistics for todos
 */
export interface TodoStats {
  total: number;
  active: number;
  completed: number;
}
