import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Todo, FilterType, TodoStats } from '../types'

/**
 * Todo Store - 使用 Composition API 風格 (Setup Store)
 *
 * Pinia 的 Setup Store 語法特點：
 * 1. 使用 ref() 定義 state
 * 2. 使用 computed() 定義 getters
 * 3. 使用普通函數定義 actions
 * 4. 最後 return 所有需要暴露的內容
 *
 * 優勢：
 * - 與 Vue 3 Composition API 完全一致的寫法
 * - 更靈活的組織代碼方式
 * - 更好的 TypeScript 類型推導
 * - 可以使用任何 Composition API 功能（如 watch、computed 等）
 */
export const useTodoStore = defineStore(
  'todo',
  () => {
    // ==================== State ====================
    // 使用 ref 定義響應式狀態

    /**
     * 所有 todo 項目
     */
    const todos = ref<Todo[]>([])

    /**
     * 當前篩選類型
     */
    const filter = ref<FilterType>('all')

    /**
     * 下一個 todo 的 ID
     */
    const nextId = ref(1)

    // ==================== Getters ====================
    // 使用 computed 定義派生狀態

    /**
     * 根據當前篩選條件過濾的 todos
     */
    const filteredTodos = computed(() => {
      switch (filter.value) {
        case 'active':
          return todos.value.filter((todo) => !todo.completed)
        case 'completed':
          return todos.value.filter((todo) => todo.completed)
        default:
          return todos.value
      }
    })

    /**
     * 總數量
     */
    const totalCount = computed(() => todos.value.length)

    /**
     * 進行中的數量
     */
    const activeCount = computed(() => todos.value.filter((todo) => !todo.completed).length)

    /**
     * 已完成的數量
     */
    const completedCount = computed(() => todos.value.filter((todo) => todo.completed).length)

    /**
     * 是否全部完成
     */
    const allCompleted = computed(() => todos.value.length > 0 && todos.value.every((todo) => todo.completed))

    /**
     * 統計資訊
     */
    const stats = computed<TodoStats>(() => ({
      total: totalCount.value,
      active: activeCount.value,
      completed: completedCount.value,
      completionRate:
        totalCount.value > 0 ? Math.round((completedCount.value / totalCount.value) * 100) : 0
    }))

    // ==================== Actions ====================
    // 使用普通函數定義 actions

    /**
     * 新增 todo
     */
    function addTodo(text: string): void {
      const trimmedText = text.trim()
      if (!trimmedText) return

      todos.value.push({
        id: nextId.value++,
        text: trimmedText,
        completed: false,
        createdAt: new Date()
      })
    }

    /**
     * 刪除 todo
     */
    function removeTodo(id: number): void {
      const index = todos.value.findIndex((todo) => todo.id === id)
      if (index !== -1) {
        todos.value.splice(index, 1)
      }
    }

    /**
     * 切換 todo 的完成狀態
     */
    function toggleTodo(id: number): void {
      const todo = todos.value.find((todo) => todo.id === id)
      if (todo) {
        todo.completed = !todo.completed
      }
    }

    /**
     * 更新 todo 文字
     */
    function updateTodo(id: number, text: string): void {
      const trimmedText = text.trim()
      if (!trimmedText) return

      const todo = todos.value.find((todo) => todo.id === id)
      if (todo) {
        todo.text = trimmedText
      }
    }

    /**
     * 切換所有 todo 的完成狀態
     */
    function toggleAll(): void {
      const shouldComplete = !allCompleted.value
      todos.value.forEach((todo) => {
        todo.completed = shouldComplete
      })
    }

    /**
     * 清除已完成的 todos
     */
    function clearCompleted(): void {
      todos.value = todos.value.filter((todo) => !todo.completed)
    }

    /**
     * 設置篩選類型
     */
    function setFilter(newFilter: FilterType): void {
      filter.value = newFilter
    }

    // ==================== Return ====================
    // 返回需要暴露的 state、getters 和 actions

    return {
      // State
      todos,
      filter,
      nextId,

      // Getters
      filteredTodos,
      totalCount,
      activeCount,
      completedCount,
      allCompleted,
      stats,

      // Actions
      addTodo,
      removeTodo,
      toggleTodo,
      updateTodo,
      toggleAll,
      clearCompleted,
      setFilter
    }
  },
  {
    // ==================== Plugin Options ====================
    // 啟用 localStorage 持久化
    persist: {
      key: 'vue-pinia-todos',
      // 只持久化需要的字段
      paths: ['todos', 'nextId']
    }
  } as any
)

/**
 * 使用示例：
 *
 * <script setup lang="ts">
 * import { useTodoStore } from '@/stores/useTodoStore'
 * import { storeToRefs } from 'pinia'
 *
 * const todoStore = useTodoStore()
 *
 * // 使用 storeToRefs 解構 state 和 getters，保持響應性
 * const { todos, filteredTodos, stats } = storeToRefs(todoStore)
 *
 * // actions 可以直接解構（不需要 storeToRefs）
 * const { addTodo, toggleTodo, removeTodo } = todoStore
 * </script>
 */
