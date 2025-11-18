/**
 * Todo Item Interface
 *
 * Represents a single todo item in the application
 */
export interface Todo {
  /**
   * Unique identifier for the todo item
   */
  id: string;

  /**
   * The text content of the todo item
   */
  text: string;

  /**
   * Whether the todo item is completed
   */
  completed: boolean;

  /**
   * Timestamp when the todo was created
   */
  createdAt: number;

  /**
   * Timestamp when the todo was last updated (optional)
   */
  updatedAt?: number;
}

/**
 * Filter type for displaying different todo views
 */
export type TodoFilter = 'all' | 'active' | 'completed';

/**
 * Statistics about todos
 */
export interface TodoStats {
  total: number;
  active: number;
  completed: number;
}
