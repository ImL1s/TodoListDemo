export interface Todo {
  id: string
  text: string
  completed: boolean
  createdAt: number
  updatedAt: number
}

export type FilterType = 'all' | 'active' | 'completed'

export interface TodoStats {
  total: number
  active: number
  completed: number
}
