/**
 * Todo Item Type Definition
 */
export interface Todo {
  id: string
  text: string
  completed: boolean
  createdAt: number
  completedAt?: number
}

/**
 * Filter Type for Todo List
 */
export type FilterType = 'all' | 'active' | 'completed'

/**
 * Todo Statistics
 */
export interface TodoStats {
  total: number
  active: number
  completed: number
  completionRate: number
}

/**
 * Local Storage Keys
 */
export const STORAGE_KEYS = {
  TODOS: 'chakra-todos',
  THEME: 'chakra-color-mode'
} as const

/**
 * Animation Variants
 */
export const ANIMATION_VARIANTS = {
  initial: { opacity: 0, y: -10 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, x: -10 }
} as const

/**
 * Color Scheme Types
 */
export type ColorSchemeType = 'light' | 'dark'
