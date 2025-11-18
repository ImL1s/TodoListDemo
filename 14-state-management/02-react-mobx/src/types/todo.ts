/**
 * Todo 項目的類型定義
 */
export interface Todo {
  id: string;
  text: string;
  completed: boolean;
  createdAt: number;
}

/**
 * 過濾器類型
 */
export type FilterType = 'all' | 'active' | 'completed';

/**
 * Todo 輸入數據
 */
export interface TodoInput {
  text: string;
}
