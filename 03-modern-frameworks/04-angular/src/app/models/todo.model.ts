/**
 * Todo Model
 *
 * Defines the structure and types for Todo items in the application.
 * This interface ensures type safety across the entire Angular application.
 */

export interface Todo {
  /**
   * Unique identifier for the todo item
   * Generated using timestamp + random string
   */
  id: string;

  /**
   * The text content of the todo item
   */
  text: string;

  /**
   * Completion status of the todo item
   */
  completed: boolean;

  /**
   * Timestamp when the todo was created
   */
  createdAt: number;
}

/**
 * Filter types for displaying todos
 */
export type FilterType = 'all' | 'active' | 'completed';

/**
 * Statistics about todos
 */
export interface TodoStats {
  total: number;
  active: number;
  completed: number;
}
