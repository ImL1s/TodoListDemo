<template>
  <div class="app">
    <!-- Custom Title Bar -->
    <div class="titlebar" data-tauri-drag-region>
      <div class="titlebar-left">
        <svg class="app-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
        <span class="app-title">Tauri Vue Todo</span>
      </div>
      <div class="titlebar-right">
        <button class="titlebar-button" @click="minimizeWindow" title="Minimize">
          <svg viewBox="0 0 12 12">
            <rect y="5" width="12" height="1" fill="currentColor" />
          </svg>
        </button>
        <button class="titlebar-button" @click="maximizeWindow" title="Maximize">
          <svg viewBox="0 0 12 12">
            <rect x="1" y="1" width="10" height="10" fill="none" stroke="currentColor" />
          </svg>
        </button>
        <button class="titlebar-button close" @click="closeWindow" title="Close">
          <svg viewBox="0 0 12 12">
            <path d="M1 1L11 11M11 1L1 11" stroke="currentColor" stroke-width="1" />
          </svg>
        </button>
      </div>
    </div>

    <!-- Main Content -->
    <div class="container">
      <header>
        <h1>📝 Todo List</h1>
        <p class="subtitle">Built with Tauri 2.0 + Vue 3 + Rust</p>
      </header>

      <!-- Add Todo Form -->
      <div class="add-form">
        <input
          v-model="newTodo"
          @keyup.enter="addTodo"
          type="text"
          placeholder="Add a new todo... (Press Enter or Ctrl+N)"
          class="todo-input"
          ref="inputRef"
        />
        <button @click="addTodo" class="btn btn-primary">
          <span>Add</span>
        </button>
      </div>

      <!-- Filter Tabs -->
      <div class="filters">
        <button
          v-for="f in filters"
          :key="f.value"
          :class="['filter-btn', { active: filter === f.value }]"
          @click="filter = f.value"
        >
          {{ f.label }}
          <span class="count">{{ getFilterCount(f.value) }}</span>
        </button>
      </div>

      <!-- Stats -->
      <div class="stats">
        <div class="stat-item">
          <span class="stat-value">{{ todos.length }}</span>
          <span class="stat-label">Total</span>
        </div>
        <div class="stat-item">
          <span class="stat-value">{{ activeTodos.length }}</span>
          <span class="stat-label">Active</span>
        </div>
        <div class="stat-item">
          <span class="stat-value">{{ completedTodos.length }}</span>
          <span class="stat-label">Completed</span>
        </div>
      </div>

      <!-- Todo List -->
      <div class="todo-list">
        <TransitionGroup name="list">
          <div
            v-for="todo in filteredTodos"
            :key="todo.id"
            :class="['todo-item', { completed: todo.completed }]"
          >
            <input
              type="checkbox"
              :checked="todo.completed"
              @change="toggleTodo(todo.id)"
              class="todo-checkbox"
            />
            <span class="todo-text">{{ todo.text }}</span>
            <div class="todo-actions">
              <span class="todo-date">{{ formatDate(todo.createdAt) }}</span>
              <button @click="deleteTodo(todo.id)" class="btn-delete" title="Delete">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>
        </TransitionGroup>

        <div v-if="filteredTodos.length === 0" class="empty-state">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <p>{{ getEmptyMessage() }}</p>
        </div>
      </div>

      <!-- Footer Actions -->
      <div class="footer-actions">
        <button @click="clearCompleted" class="btn btn-secondary" :disabled="completedTodos.length === 0">
          Clear Completed ({{ completedTodos.length }})
        </button>
        <button @click="showAbout" class="btn btn-secondary">
          About
        </button>
      </div>

      <!-- Keyboard Shortcuts Info -->
      <div class="shortcuts">
        <strong>Shortcuts:</strong>
        Ctrl+N (New) | Ctrl+F (Filter) | Ctrl+Q (Quit) | Ctrl+R (Refresh)
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { invoke } from '@tauri-apps/api/core'
import { getCurrentWindow } from '@tauri-apps/api/window'
import { listen } from '@tauri-apps/api/event'

// Types
interface Todo {
  id: number
  text: string
  completed: boolean
  createdAt: number
}

type FilterType = 'all' | 'active' | 'completed'

// State
const todos = ref<Todo[]>([])
const newTodo = ref('')
const filter = ref<FilterType>('all')
const inputRef = ref<HTMLInputElement | null>(null)

const filters = [
  { label: 'All', value: 'all' as FilterType },
  { label: 'Active', value: 'active' as FilterType },
  { label: 'Completed', value: 'completed' as FilterType }
]

// Computed
const activeTodos = computed(() => todos.value.filter(t => !t.completed))
const completedTodos = computed(() => todos.value.filter(t => t.completed))
const filteredTodos = computed(() => {
  switch (filter.value) {
    case 'active':
      return activeTodos.value
    case 'completed':
      return completedTodos.value
    default:
      return todos.value
  }
})

// Methods
const loadTodos = async () => {
  try {
    const loaded = await invoke<Todo[]>('get_todos')
    todos.value = loaded
  } catch (error) {
    console.error('Failed to load todos:', error)
  }
}

const saveTodos = async () => {
  try {
    await invoke('save_todos', { todos: todos.value })
  } catch (error) {
    console.error('Failed to save todos:', error)
  }
}

const addTodo = async () => {
  const text = newTodo.value.trim()
  if (!text) return

  const todo: Todo = {
    id: Date.now(),
    text,
    completed: false,
    createdAt: Date.now()
  }

  todos.value.unshift(todo)
  newTodo.value = ''
  await saveTodos()
}

const toggleTodo = async (id: number) => {
  const todo = todos.value.find(t => t.id === id)
  if (todo) {
    todo.completed = !todo.completed
    await saveTodos()
  }
}

const deleteTodo = async (id: number) => {
  todos.value = todos.value.filter(t => t.id !== id)
  await saveTodos()
}

const clearCompleted = async () => {
  todos.value = activeTodos.value
  await saveTodos()
}

const getFilterCount = (filterValue: FilterType): number => {
  switch (filterValue) {
    case 'active':
      return activeTodos.value.length
    case 'completed':
      return completedTodos.value.length
    default:
      return todos.value.length
  }
}

const getEmptyMessage = (): string => {
  switch (filter.value) {
    case 'active':
      return 'No active todos. Great job!'
    case 'completed':
      return 'No completed todos yet.'
    default:
      return 'No todos yet. Add one to get started!'
  }
}

const formatDate = (timestamp: number): string => {
  const date = new Date(timestamp)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 1) return 'Just now'
  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays < 7) return `${diffDays}d ago`

  return date.toLocaleDateString()
}

const showAbout = async () => {
  try {
    await invoke('show_about')
  } catch (error) {
    console.error('Failed to show about:', error)
  }
}

// Window Controls
const appWindow = getCurrentWindow()

const minimizeWindow = async () => {
  await appWindow.minimize()
}

const maximizeWindow = async () => {
  await appWindow.toggleMaximize()
}

const closeWindow = async () => {
  await appWindow.close()
}

// Keyboard Shortcuts
const handleKeyboard = (e: KeyboardEvent) => {
  if (e.ctrlKey || e.metaKey) {
    switch (e.key.toLowerCase()) {
      case 'n':
        e.preventDefault()
        inputRef.value?.focus()
        break
      case 'f':
        e.preventDefault()
        const currentIndex = filters.findIndex(f => f.value === filter.value)
        const nextIndex = (currentIndex + 1) % filters.length
        filter.value = filters[nextIndex].value
        break
      case 'r':
        e.preventDefault()
        loadTodos()
        break
    }
  }
}

// Lifecycle
onMounted(async () => {
  await loadTodos()
  window.addEventListener('keydown', handleKeyboard)

  // Listen for refresh event from menu
  await listen('refresh-todos', () => {
    loadTodos()
  })
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyboard)
})
</script>

<style scoped>
.app {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: var(--bg-secondary);
}

/* Custom Title Bar */
.titlebar {
  height: 32px;
  background: var(--bg-primary);
  border-bottom: 1px solid var(--border-color);
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 8px;
  user-select: none;
}

.titlebar-left {
  display: flex;
  align-items: center;
  gap: 8px;
}

.app-icon {
  width: 16px;
  height: 16px;
  color: var(--primary-color);
}

.app-title {
  font-size: 12px;
  font-weight: 500;
  color: var(--text-primary);
}

.titlebar-right {
  display: flex;
  gap: 4px;
}

.titlebar-button {
  width: 28px;
  height: 28px;
  border: none;
  background: transparent;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  color: var(--text-secondary);
  transition: all 0.2s;
}

.titlebar-button svg {
  width: 12px;
  height: 12px;
}

.titlebar-button:hover {
  background: var(--bg-hover);
  color: var(--text-primary);
}

.titlebar-button.close:hover {
  background: var(--danger-color);
  color: white;
}

/* Main Container */
.container {
  flex: 1;
  overflow-y: auto;
  padding: 32px;
  max-width: 800px;
  margin: 0 auto;
  width: 100%;
}

header {
  text-align: center;
  margin-bottom: 32px;
}

h1 {
  font-size: 36px;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 8px;
}

.subtitle {
  color: var(--text-secondary);
  font-size: 14px;
}

/* Add Form */
.add-form {
  display: flex;
  gap: 12px;
  margin-bottom: 24px;
}

.todo-input {
  flex: 1;
  padding: 12px 16px;
  border: 2px solid var(--border-color);
  border-radius: 8px;
  font-size: 16px;
  transition: all 0.2s;
  background: var(--bg-primary);
  color: var(--text-primary);
}

.todo-input:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgba(14, 165, 233, 0.1);
}

/* Buttons */
.btn {
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.btn-primary {
  background: var(--primary-color);
  color: white;
}

.btn-primary:hover {
  background: var(--primary-hover);
  transform: translateY(-1px);
  box-shadow: var(--shadow-lg);
}

.btn-secondary {
  background: var(--bg-primary);
  color: var(--text-primary);
  border: 2px solid var(--border-color);
}

.btn-secondary:hover:not(:disabled) {
  background: var(--bg-hover);
  border-color: var(--text-secondary);
}

.btn-secondary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Filters */
.filters {
  display: flex;
  gap: 8px;
  margin-bottom: 24px;
  background: var(--bg-primary);
  padding: 4px;
  border-radius: 8px;
}

.filter-btn {
  flex: 1;
  padding: 10px 16px;
  border: none;
  background: transparent;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  color: var(--text-secondary);
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.filter-btn:hover {
  background: var(--bg-hover);
  color: var(--text-primary);
}

.filter-btn.active {
  background: var(--primary-color);
  color: white;
}

.count {
  background: rgba(0, 0, 0, 0.1);
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
}

.filter-btn.active .count {
  background: rgba(255, 255, 255, 0.2);
}

/* Stats */
.stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  margin-bottom: 24px;
}

.stat-item {
  background: var(--bg-primary);
  padding: 20px;
  border-radius: 12px;
  text-align: center;
  box-shadow: var(--shadow);
}

.stat-value {
  display: block;
  font-size: 32px;
  font-weight: 700;
  color: var(--primary-color);
  margin-bottom: 4px;
}

.stat-label {
  font-size: 14px;
  color: var(--text-secondary);
  font-weight: 500;
}

/* Todo List */
.todo-list {
  background: var(--bg-primary);
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 24px;
  min-height: 300px;
  max-height: 400px;
  overflow-y: auto;
  box-shadow: var(--shadow);
}

.todo-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  border-radius: 8px;
  margin-bottom: 8px;
  background: var(--bg-secondary);
  transition: all 0.2s;
}

.todo-item:hover {
  background: var(--bg-hover);
  transform: translateX(4px);
}

.todo-item.completed {
  opacity: 0.6;
}

.todo-checkbox {
  width: 20px;
  height: 20px;
  cursor: pointer;
  flex-shrink: 0;
}

.todo-text {
  flex: 1;
  font-size: 16px;
  color: var(--text-primary);
}

.todo-item.completed .todo-text {
  text-decoration: line-through;
  color: var(--text-secondary);
}

.todo-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.todo-date {
  font-size: 12px;
  color: var(--text-secondary);
}

.btn-delete {
  padding: 8px;
  border: none;
  background: transparent;
  cursor: pointer;
  border-radius: 6px;
  color: var(--text-secondary);
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn-delete svg {
  width: 20px;
  height: 20px;
}

.btn-delete:hover {
  background: var(--danger-color);
  color: white;
  transform: scale(1.1);
}

/* Empty State */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  color: var(--text-secondary);
}

.empty-state svg {
  width: 64px;
  height: 64px;
  margin-bottom: 16px;
  opacity: 0.5;
}

.empty-state p {
  font-size: 16px;
}

/* Footer Actions */
.footer-actions {
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
}

.footer-actions .btn {
  flex: 1;
}

/* Shortcuts */
.shortcuts {
  text-align: center;
  font-size: 12px;
  color: var(--text-secondary);
  padding: 12px;
  background: var(--bg-primary);
  border-radius: 8px;
}

.shortcuts strong {
  color: var(--text-primary);
}

/* List Transitions */
.list-enter-active,
.list-leave-active {
  transition: all 0.3s ease;
}

.list-enter-from {
  opacity: 0;
  transform: translateX(-30px);
}

.list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

.list-move {
  transition: transform 0.3s ease;
}
</style>
