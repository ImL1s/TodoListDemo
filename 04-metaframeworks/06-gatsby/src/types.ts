/**
 * Type Definitions for Gatsby Todo App
 */

// Todo item interface
export interface Todo {
  id: string;
  text: string;
  completed: boolean;
  createdAt: number;
}

// Filter types
export type FilterType = 'all' | 'active' | 'completed';

// Todo statistics
export interface TodoStats {
  total: number;
  active: number;
  completed: number;
}

// Local storage keys
export const STORAGE_KEY = 'gatsby-todos';

// Component prop types
export interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string, newText: string) => void;
}

export interface TodoListProps {
  todos: Todo[];
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string, newText: string) => void;
}

export interface TodoInputProps {
  onAdd: (text: string) => void;
}

// Hook return types
export interface UseTodosReturn {
  todos: Todo[];
  filteredTodos: Todo[];
  filter: FilterType;
  stats: TodoStats;
  addTodo: (text: string) => void;
  toggleTodo: (id: string) => void;
  deleteTodo: (id: string) => void;
  editTodo: (id: string, newText: string) => void;
  setFilter: (filter: FilterType) => void;
  clearCompleted: () => void;
}
