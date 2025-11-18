/**
 * Todo 項目接口
 */
export interface Todo {
  id: string
  text: string
  completed: boolean
}

/**
 * TodoInput 組件的 Emits 類型
 */
export interface TodoInputEmits {
  (event: 'add', text: string): void
}

/**
 * TodoItem 組件的 Props 類型
 */
export interface TodoItemProps {
  todo: Todo
}

/**
 * TodoItem 組件的 Emits 類型
 */
export interface TodoItemEmits {
  (event: 'toggle', id: string): void
  (event: 'delete', id: string): void
}

/**
 * TodoList 組件的 Props 類型
 */
export interface TodoListProps {
  todos: Todo[]
}

/**
 * TodoList 組件的 Emits 類型
 */
export interface TodoListEmits {
  (event: 'toggle', id: string): void
  (event: 'delete', id: string): void
}

/**
 * LocalStorage 的鍵名
 */
export const STORAGE_KEY = 'vue3-ts-todos' as const
