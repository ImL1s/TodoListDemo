/**
 * Todo 項目介面定義
 */
export interface Todo {
  /** 唯一識別碼 */
  id: number
  /** 待辦事項文字內容 */
  text: string
  /** 完成狀態 */
  completed: boolean
  /** 創建時間戳記 */
  createdAt: number
}

/**
 * 過濾器類型
 */
export type FilterType = 'all' | 'active' | 'completed'

/**
 * 統計資訊介面
 */
export interface TodoStats {
  /** 總數量 */
  total: number
  /** 活躍數量 */
  active: number
  /** 完成數量 */
  completed: number
  /** 完成百分比 */
  completionRate: number
}

/**
 * 主題類型
 */
export type ThemeType = 'light' | 'dark'

/**
 * 應用設定介面
 */
export interface AppSettings {
  /** 主題模式 */
  theme: ThemeType
  /** 語言設定 */
  locale?: string
}
