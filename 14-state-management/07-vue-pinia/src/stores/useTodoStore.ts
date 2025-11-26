import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Todo, FilterType } from '../types'

/**
 * Pinia Store for managing todos
 * 使用 Composition API 風格 (Setup Store)
 *
 * Pinia 特點：
 * 1. 扁平化結構，沒有 mutations
 * 2. TypeScript 支持更好
 * 3. 更簡潔的 API
 * 4. 自動的 DevTools 支持
 */
export const useTodoStore = defineStore('todo', () => {
  // State
  const todos = ref<Todo[]>([])
  const filter = ref<FilterType>('all')
  const nextId = ref(1)

  // Getters (使用 computed)
  const filteredTodos = computed(() => {
    switch (filter.value) {
      case 'active':
        return todos.value.filter(todo => !todo.completed)
      case 'completed':
        return todos.value.filter(todo => todo.completed)
      default:
        return todos.value
    }
  })

  const totalCount = computed(() => todos.value.length)

  const activeCount = computed(() =>
    todos.value.filter(todo => !todo.completed).length
  )

  const completedCount = computed(() =>
    todos.value.filter(todo => todo.completed).length
  )

  const allCompleted = computed(() =>
    todos.value.length > 0 && todos.value.every(todo => todo.completed)
  )

  const stats = computed(() => ({
    total: totalCount.value,
    active: activeCount.value,
    completed: completedCount.value,
    completionRate: totalCount.value > 0
      ? Math.round((completedCount.value / totalCount.value) * 100)
      : 0
  }))

  // Actions
  function addTodo(text: string) {
    const trimmedText = text.trim()
    if (!trimmedText) return

    todos.value.push({
      id: nextId.value++,
      text: trimmedText,
      completed: false,
      createdAt: new Date()
    })
  }

  function removeTodo(id: number) {
    const index = todos.value.findIndex(todo => todo.id === id)
    if (index !== -1) {
      todos.value.splice(index, 1)
    }
  }

  function toggleTodo(id: number) {
    const todo = todos.value.find(todo => todo.id === id)
    if (todo) {
      todo.completed = !todo.completed
    }
  }

  function updateTodo(id: number, text: string) {
    const todo = todos.value.find(todo => todo.id === id)
    if (todo) {
      todo.text = text.trim()
    }
  }

  function toggleAll() {
    const shouldComplete = !allCompleted.value
    todos.value.forEach(todo => {
      todo.completed = shouldComplete
    })
  }

  function clearCompleted() {
    todos.value = todos.value.filter(todo => !todo.completed)
  }

  function setFilter(newFilter: FilterType) {
    filter.value = newFilter
  }

  // 從 localStorage 載入數據
  function loadFromStorage() {
    try {
      const stored = localStorage.getItem('vue-pinia-todos')
      if (stored) {
        const data = JSON.parse(stored)
        todos.value = data.todos.map((todo: any) => ({
          ...todo,
          createdAt: new Date(todo.createdAt)
        }))
        nextId.value = data.nextId
      }
    } catch (error) {
      console.error('Failed to load todos from storage:', error)
    }
  }

  // 保存到 localStorage
  function saveToStorage() {
    try {
      localStorage.setItem('vue-pinia-todos', JSON.stringify({
        todos: todos.value,
        nextId: nextId.value
      }))
    } catch (error) {
      console.error('Failed to save todos to storage:', error)
    }
  }

  return {
    // State
    todos,
    filter,

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
    setFilter,
    loadFromStorage,
    saveToStorage
  }
})
