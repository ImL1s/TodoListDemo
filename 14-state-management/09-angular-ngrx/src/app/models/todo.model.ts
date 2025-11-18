export interface Todo {
  id: string;
  text: string;
  completed: boolean;
  createdAt: number;
}

export type FilterType = 'all' | 'active' | 'completed';

export interface TodoState {
  filter: FilterType;
}
