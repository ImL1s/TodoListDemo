/**
 * Todo item interface
 */
export interface Todo {
  id: string;
  text: string;
  completed: boolean;
  createdAt: number;
  priority?: 'low' | 'medium' | 'high';
}

/**
 * Filter type for todo list
 */
export type FilterType = 'all' | 'active' | 'completed';

/**
 * Todo store interface for Zustand
 */
export interface TodoStore {
  todos: Todo[];
  filter: FilterType;
  addTodo: (text: string, priority?: Todo['priority']) => void;
  toggleTodo: (id: string) => void;
  deleteTodo: (id: string) => void;
  editTodo: (id: string, text: string) => void;
  setFilter: (filter: FilterType) => void;
  clearCompleted: () => void;
  filteredTodos: () => Todo[];
}
