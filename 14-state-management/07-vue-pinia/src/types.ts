export interface Todo {
  id: number
  text: string
  completed: boolean
  createdAt: Date
}

export type FilterType = 'all' | 'active' | 'completed'
