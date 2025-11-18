/**
 * Todo Item Interface
 * Defines the structure of a single todo item
 */
export interface Todo {
  id: string
  text: string
  completed: boolean
  createdAt: number
  completedAt?: number
}

/**
 * Filter Type
 * Defines the available filter options for todo list
 */
export type FilterType = 'all' | 'active' | 'completed'

/**
 * Theme Type
 * Defines the available theme options
 */
export type ThemeType = 'light' | 'dark'

/**
 * Todo Statistics Interface
 * Provides statistics about the todo list
 */
export interface TodoStats {
  total: number
  active: number
  completed: number
  completionRate: number
}

/**
 * Local Storage Keys
 * Centralized storage key definitions
 */
export const STORAGE_KEYS = {
  TODOS: 'naive-ui-todos',
  THEME: 'naive-ui-theme'
} as const
