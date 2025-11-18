/**
 * Todo item interface
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
 * Todo action types for reducer pattern
 */
export type TodoAction =
  | { type: 'ADD_TODO'; payload: { text: string } }
  | { type: 'TOGGLE_TODO'; payload: { id: string } }
  | { type: 'DELETE_TODO'; payload: { id: string } }
  | { type: 'LOAD_TODOS'; payload: { todos: Todo[] } };
