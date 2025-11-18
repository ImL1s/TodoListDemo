/**
 * Todo item interface
 * Matches the Rust Todo struct for type safety across the Tauri bridge
 */
export interface Todo {
  id: string;
  text: string;
  completed: boolean;
  createdAt: number;
}

/**
 * Props for TodoInput component
 */
export interface TodoInputProps {
  onAdd: (text: string) => void;
}

/**
 * Props for TodoList component
 */
export interface TodoListProps {
  todos: Todo[];
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

/**
 * Props for TodoItem component
 */
export interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}
