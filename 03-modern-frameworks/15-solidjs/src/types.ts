/**
 * Type Definitions for SolidJS Todo List
 *
 * These types define the shape of our application state and operations.
 * SolidJS works seamlessly with TypeScript for type-safe reactive programming.
 */

export interface Todo {
  id: string;
  text: string;
  completed: boolean;
  createdAt: number;
}

export type FilterType = 'all' | 'active' | 'completed';

export interface TodoStore {
  todos: Todo[];
  filter: FilterType;
}

export interface TodoActions {
  addTodo: (text: string) => void;
  toggleTodo: (id: string) => void;
  deleteTodo: (id: string) => void;
  editTodo: (id: string, text: string) => void;
  clearCompleted: () => void;
  toggleAll: () => void;
  setFilter: (filter: FilterType) => void;
}
