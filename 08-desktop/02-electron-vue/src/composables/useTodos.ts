import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import type { Todo, FilterType, TodoStats } from '../types'

export function useTodos() {
  const todos = ref<Todo[]>([])
  const filter = ref<FilterType>('all')
  const loading = ref(true)

  // Computed properties
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

  const stats = computed<TodoStats>(() => ({
    total: todos.value.length,
    active: todos.value.filter(t => !t.completed).length,
    completed: todos.value.filter(t => t.completed).length
  }))

  const hasActiveTodos = computed(() => stats.value.active > 0)
  const hasCompletedTodos = computed(() => stats.value.completed > 0)

  // CRUD operations
  const addTodo = (text: string) => {
    if (!text.trim()) return

    const newTodo: Todo = {
      id: Date.now().toString(),
      text: text.trim(),
      completed: false,
      createdAt: Date.now(),
      updatedAt: Date.now()
    }

    todos.value.push(newTodo)
  }

  const updateTodo = (id: string, text: string) => {
    const todo = todos.value.find(t => t.id === id)
    if (todo) {
      todo.text = text.trim()
      todo.updatedAt = Date.now()
    }
  }

  const toggleTodo = (id: string) => {
    const todo = todos.value.find(t => t.id === id)
    if (todo) {
      todo.completed = !todo.completed
      todo.updatedAt = Date.now()
    }
  }

  const deleteTodo = (id: string) => {
    const index = todos.value.findIndex(t => t.id === id)
    if (index > -1) {
      todos.value.splice(index, 1)
    }
  }

  const toggleAll = () => {
    const hasActive = hasActiveTodos.value
    todos.value.forEach(todo => {
      todo.completed = hasActive
      todo.updatedAt = Date.now()
    })
  }

  const clearCompleted = () => {
    todos.value = todos.value.filter(t => !t.completed)
  }

  // File operations
  const loadTodos = async () => {
    loading.value = true
    try {
      const loaded = await window.electronAPI.loadTodos()
      todos.value = loaded || []
    } catch (error) {
      console.error('Failed to load todos:', error)
      todos.value = []
    } finally {
      loading.value = false
    }
  }

  const saveTodos = async () => {
    try {
      await window.electronAPI.saveTodos(todos.value)
    } catch (error) {
      console.error('Failed to save todos:', error)
    }
  }

  // Auto-save when todos change
  watch(todos, () => {
    saveTodos()
  }, { deep: true })

  // Listen for menu events
  const setupMenuListeners = () => {
    // Filter events from menu
    window.electronAPI.onFilterChange?.((newFilter: FilterType) => {
      filter.value = newFilter
    })

    // Clear completed from menu
    window.electronAPI.onClearCompleted?.(() => {
      clearCompleted()
    })

    // Quick add from tray
    window.electronAPI.onQuickAdd?.((text: string) => {
      addTodo(text)
    })
  }

  // Load todos on mount
  onMounted(() => {
    loadTodos()
    setupMenuListeners()
  })

  return {
    // State
    todos: filteredTodos,
    filter,
    loading,
    stats,
    hasActiveTodos,
    hasCompletedTodos,

    // Methods
    addTodo,
    updateTodo,
    toggleTodo,
    deleteTodo,
    toggleAll,
    clearCompleted,
    setFilter: (newFilter: FilterType) => { filter.value = newFilter }
  }
}
