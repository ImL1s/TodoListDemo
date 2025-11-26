/**
 * Type definitions for the Todo List application with Valtio
 */

export type FilterType = 'all' | 'active' | 'completed';

export interface Todo {
  id: string;
  text: string;
  completed: boolean;
  createdAt: number;
}

export interface TodoState {
  todos: Todo[];
  filter: FilterType;
}

export interface TodoStats {
  total: number;
  active: number;
  completed: number;
}
