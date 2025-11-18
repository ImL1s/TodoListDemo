/**
 * Todo item type definition
 */
export interface Todo {
  /**
   * Unique identifier for the todo item
   */
  id: string;

  /**
   * Text content of the todo
   */
  text: string;

  /**
   * Completion status
   */
  completed: boolean;

  /**
   * Creation timestamp
   */
  createdAt: number;
}

/**
 * Props for TodoInput component
 */
export interface TodoInputProps {
  /**
   * Callback when a new todo is added
   */
  onAddTodo: (text: string) => void;
}

/**
 * Props for TodoList component
 */
export interface TodoListProps {
  /**
   * Array of todo items to display
   */
  todos: Todo[];

  /**
   * Callback when a todo's completion status is toggled
   */
  onToggleTodo: (id: string) => void;

  /**
   * Callback when a todo is deleted
   */
  onDeleteTodo: (id: string) => void;
}

/**
 * Props for TodoItem component
 */
export interface TodoItemProps {
  /**
   * The todo item to display
   */
  todo: Todo;

  /**
   * Callback when the todo's completion status is toggled
   */
  onToggle: () => void;

  /**
   * Callback when the todo is deleted
   */
  onDelete: () => void;
}

/**
 * Filter types for todo list
 */
export type FilterType = 'all' | 'active' | 'completed';

/**
 * Storage keys for AsyncStorage
 */
export enum StorageKeys {
  TODOS = '@TodoList:todos',
}
