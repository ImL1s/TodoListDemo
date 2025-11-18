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
 * Filter options for displaying todos
 */
export type FilterType = 'all' | 'active' | 'completed';

/**
 * Todo context state interface
 */
export interface TodoContextType {
  todos: Todo[];
  filter: FilterType;
  addTodo: (text: string) => void;
  toggleTodo: (id: string) => void;
  deleteTodo: (id: string) => void;
  editTodo: (id: string, text: string) => void;
  setFilter: (filter: FilterType) => void;
  clearCompleted: () => void;
}

/**
 * Statistics derived from todo list
 */
export interface TodoStats {
  total: number;
  active: number;
  completed: number;
}
