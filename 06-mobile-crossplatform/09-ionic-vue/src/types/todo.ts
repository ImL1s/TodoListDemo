/**
 * Todo item interface
 */
export interface Todo {
  id: number
  text: string
  completed: boolean
  createdAt: string
}

/**
 * Filter types for todo list
 */
export type FilterType = 'all' | 'active' | 'completed'

/**
 * Todo statistics
 */
export interface TodoStats {
  total: number
  completed: number
  active: number
  completionPercentage: number
}

/**
 * Todo filter option
 */
export interface FilterOption {
  value: FilterType
  label: string
  count: number
}
