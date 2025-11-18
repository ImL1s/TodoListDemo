/**
 * Todo List TypeScript 類型定義
 */

export interface Todo {
  id: string;
  text: string;
  completed: boolean;
  createdAt: number;
  updatedAt: number;
}

export type FilterType = 'all' | 'active' | 'completed';

export interface TodoStats {
  total: number;
  active: number;
  completed: number;
}
