import { ref, computed } from 'vue'
import type { Todo, FilterType } from '@/types'
import { useStorage } from './useStorage'
import { useToast } from './useToast'
import { useHaptics } from './useHaptics'

const STORAGE_KEY = 'todos'

/**
 * Composable for managing todos
 */
export function useTodos() {
  // Storage
  const storage = useStorage<Todo[]>(STORAGE_KEY, [])
  const { showSuccess, showWarning, showError } = useToast()
  const haptics = useHaptics()

  // State
  const todos = ref<Todo[]>([])
  const filter = ref<FilterType>('all')
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Computed
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

  const incompleteTodoCount = computed(() => {
    return todos.value.filter(todo => !todo.completed).length
  })

  const completedTodoCount = computed(() => {
    return todos.value.filter(todo => todo.completed).length
  })

  const totalTodoCount = computed(() => {
    return todos.value.length
  })

  const completionPercentage = computed(() => {
    if (todos.value.length === 0) return 0
    return Math.round((completedTodoCount.value / todos.value.length) * 100)
  })

  const emptyStateMessage = computed(() => {
    switch (filter.value) {
      case 'active':
        return 'No active tasks. Great job!'
      case 'completed':
        return 'No completed tasks yet'
      default:
        return 'No tasks yet. Add one above!'
    }
  })

  const hasCompletedTodos = computed(() => completedTodoCount.value > 0)
  const hasTodos = computed(() => todos.value.length > 0)

  // Methods
  /**
   * Load todos from storage
   */
  const loadTodos = async () => {
    loading.value = true
    error.value = null

    try {
      const loadedTodos = await storage.load()
      todos.value = loadedTodos
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load todos'
      error.value = errorMessage
      await showError(errorMessage)
    } finally {
      loading.value = false
    }
  }

  /**
   * Save todos to storage
   */
  const saveTodos = async () => {
    try {
      await storage.save(todos.value)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to save todos'
      error.value = errorMessage
      await showError(errorMessage)
      throw err
    }
  }

  /**
   * Add a new todo
   * @param text - Todo text
   */
  const addTodo = async (text: string) => {
    if (!text.trim()) {
      await showWarning('Please enter a task')
      return
    }

    const newTodo: Todo = {
      id: Date.now(),
      text: text.trim(),
      completed: false,
      createdAt: new Date().toISOString()
    }

    todos.value.unshift(newTodo)
    await saveTodos()
    await haptics.lightImpact()
    await showSuccess('Task added successfully')
  }

  /**
   * Toggle todo completion status
   * @param id - Todo ID
   */
  const toggleTodo = async (id: number) => {
    const todo = todos.value.find(t => t.id === id)

    if (!todo) {
      await showError('Task not found')
      return
    }

    todo.completed = !todo.completed
    await saveTodos()

    if (todo.completed) {
      await haptics.success()
      await showSuccess('Task completed!')
    } else {
      await haptics.warning()
      await showWarning('Task marked as active')
    }
  }

  /**
   * Delete a todo
   * @param id - Todo ID
   */
  const deleteTodo = async (id: number) => {
    const index = todos.value.findIndex(t => t.id === id)

    if (index === -1) {
      await showError('Task not found')
      return
    }

    todos.value.splice(index, 1)
    await saveTodos()
    await haptics.mediumImpact()
    await showSuccess('Task deleted')
  }

  /**
   * Update todo text
   * @param id - Todo ID
   * @param text - New text
   */
  const updateTodo = async (id: number, text: string) => {
    const todo = todos.value.find(t => t.id === id)

    if (!todo) {
      await showError('Task not found')
      return
    }

    if (!text.trim()) {
      await showWarning('Task text cannot be empty')
      return
    }

    todo.text = text.trim()
    await saveTodos()
    await haptics.lightImpact()
    await showSuccess('Task updated')
  }

  /**
   * Clear all completed todos
   */
  const clearCompleted = async () => {
    const count = completedTodoCount.value
    todos.value = todos.value.filter(t => !t.completed)
    await saveTodos()
    await haptics.mediumImpact()
    await showSuccess(`${count} task${count > 1 ? 's' : ''} cleared`)
  }

  /**
   * Clear all todos
   */
  const clearAll = async () => {
    todos.value = []
    await saveTodos()
    await haptics.heavyImpact()
    await showSuccess('All tasks cleared')
  }

  /**
   * Set filter
   * @param newFilter - Filter type
   */
  const setFilter = (newFilter: FilterType) => {
    filter.value = newFilter
    haptics.selectionChanged()
  }

  /**
   * Refresh todos (reload from storage)
   */
  const refresh = async () => {
    await loadTodos()
    await haptics.lightImpact()
  }

  return {
    // State
    todos,
    filter,
    loading,
    error,

    // Computed
    filteredTodos,
    incompleteTodoCount,
    completedTodoCount,
    totalTodoCount,
    completionPercentage,
    emptyStateMessage,
    hasCompletedTodos,
    hasTodos,

    // Methods
    loadTodos,
    saveTodos,
    addTodo,
    toggleTodo,
    deleteTodo,
    updateTodo,
    clearCompleted,
    clearAll,
    setFilter,
    refresh
  }
}
