/**
 * Todo 項目的介面定義
 */
export interface Todo {
  id: string;
  text: string;
  completed: boolean;
  createdAt: number;
}

/**
 * 篩選類型
 */
export type FilterType = 'all' | 'active' | 'completed';

/**
 * Todo 狀態介面
 */
export interface TodosState {
  items: Todo[];
  filter: FilterType;
  editingId: string | null;
}
