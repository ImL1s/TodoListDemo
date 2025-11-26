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
 * 統計數據的類型
 */
export interface TodoStats {
  total: number;
  active: number;
  completed: number;
}
