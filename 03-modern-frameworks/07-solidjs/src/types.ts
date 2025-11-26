/**
 * Todo 項目的數據結構
 */
export interface Todo {
  id: string;
  text: string;
  completed: boolean;
  createdAt: number;
  completedAt?: number;
}

/**
 * 篩選器類型
 */
export type FilterType = 'all' | 'active' | 'completed';

/**
 * TodoInput 組件的 Props 類型
 */
export interface TodoInputProps {
  onAddTodo: (text: string) => void;
}

/**
 * TodoList 組件的 Props 類型
 */
export interface TodoListProps {
  todos: Todo[];
  onToggleTodo: (id: string) => void;
  onDeleteTodo: (id: string) => void;
  onEditTodo: (id: string, newText: string) => void;
}

/**
 * TodoItem 組件的 Props 類型
 */
export interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string, newText: string) => void;
}

/**
 * 統計數據的類型
 */
export interface TodoStats {
  total: number;
  active: number;
  completed: number;
}
