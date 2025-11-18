// Todo 項目接口
export interface Todo {
  id: string;
  text: string;
  completed: boolean;
  createdAt: number;
}

// 篩選類型
export type FilterType = 'all' | 'active' | 'completed';

// 編輯狀態
export interface EditingState {
  id: string;
  text: string;
}
