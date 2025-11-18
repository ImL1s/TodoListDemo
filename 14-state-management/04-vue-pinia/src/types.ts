/**
 * Todo 項目類型定義
 */
export interface Todo {
  id: number
  text: string
  completed: boolean
  createdAt: Date
}

/**
 * 篩選類型
 */
export type FilterType = 'all' | 'active' | 'completed'

/**
 * Todo 統計資訊
 */
export interface TodoStats {
  total: number
  active: number
  completed: number
  completionRate: number
}
