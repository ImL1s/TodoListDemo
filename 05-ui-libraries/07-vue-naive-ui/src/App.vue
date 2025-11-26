<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import {
  NConfigProvider,
  NLayout,
  NLayoutHeader,
  NLayoutContent,
  NCard,
  NSpace,
  NButton,
  NSelect,
  NTag,
  darkTheme,
  useMessage,
  type GlobalThemeOverrides
} from 'naive-ui'
import { MoonOutline, SunnyOutline } from '@vicons/ionicons5'
import TodoInput from './components/TodoInput.vue'
import TodoList from './components/TodoList.vue'
import type { Todo, FilterType, ThemeType, TodoStats } from './types'
import { STORAGE_KEYS } from './types'

// Theme state
const isDark = ref<boolean>(false)
const theme = computed(() => (isDark.value ? darkTheme : null))

// Custom theme overrides for better styling
const themeOverrides: GlobalThemeOverrides = {
  common: {
    primaryColor: '#18a058',
    primaryColorHover: '#36ad6a',
    primaryColorPressed: '#0c7a43',
    primaryColorSuppl: '#36ad6a'
  }
}

// Message API
const message = useMessage()

// Todo state
const todos = ref<Todo[]>([])
const filter = ref<FilterType>('all')

// Filter options for select
const filterOptions = [
  { label: 'All Tasks', value: 'all' },
  { label: 'Active', value: 'active' },
  { label: 'Completed', value: 'completed' }
]

// Computed filtered todos
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

// Computed statistics
const stats = computed<TodoStats>(() => {
  const total = todos.value.length
  const completed = todos.value.filter(todo => todo.completed).length
  const active = total - completed
  const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0

  return { total, active, completed, completionRate }
})

// Add new todo
const handleAddTodo = (text: string) => {
  const newTodo: Todo = {
    id: Date.now().toString(),
    text,
    completed: false,
    createdAt: Date.now()
  }

  todos.value.unshift(newTodo)
  message.success('Task added successfully!')
}

// Toggle todo completion
const handleToggleTodo = (id: string) => {
  const todo = todos.value.find(t => t.id === id)
  if (todo) {
    todo.completed = !todo.completed
    todo.completedAt = todo.completed ? Date.now() : undefined

    message.info(todo.completed ? 'Task completed!' : 'Task marked as active')
  }
}

// Delete todo
const handleDeleteTodo = (id: string) => {
  const index = todos.value.findIndex(t => t.id === id)
  if (index > -1) {
    todos.value.splice(index, 1)
    message.warning('Task deleted')
  }
}

// Edit todo
const handleEditTodo = (id: string, newText: string) => {
  const todo = todos.value.find(t => t.id === id)
  if (todo) {
    todo.text = newText
    message.success('Task updated!')
  }
}

// Clear completed todos
const handleClearCompleted = () => {
  const completedCount = todos.value.filter(t => t.completed).length
  if (completedCount === 0) {
    message.warning('No completed tasks to clear')
    return
  }

  todos.value = todos.value.filter(t => !t.completed)
  message.success(`Cleared ${completedCount} completed task${completedCount > 1 ? 's' : ''}`)
}

// Toggle theme
const toggleTheme = () => {
  isDark.value = !isDark.value
  localStorage.setItem(STORAGE_KEYS.THEME, isDark.value ? 'dark' : 'light')
}

// Load data from localStorage
const loadFromStorage = () => {
  try {
    const savedTodos = localStorage.getItem(STORAGE_KEYS.TODOS)
    if (savedTodos) {
      todos.value = JSON.parse(savedTodos)
    }

    const savedTheme = localStorage.getItem(STORAGE_KEYS.THEME) as ThemeType
    if (savedTheme) {
      isDark.value = savedTheme === 'dark'
    }
  } catch (error) {
    console.error('Error loading from localStorage:', error)
  }
}

// Save todos to localStorage
watch(
  todos,
  (newTodos) => {
    localStorage.setItem(STORAGE_KEYS.TODOS, JSON.stringify(newTodos))
  },
  { deep: true }
)

// Load data on mount
onMounted(() => {
  loadFromStorage()
})
</script>

<template>
  <n-config-provider :theme="theme" :theme-overrides="themeOverrides">
    <n-layout style="min-height: 100vh; background: var(--n-color)">
      <n-layout-header bordered style="padding: 16px 24px">
        <div style="max-width: 800px; margin: 0 auto; display: flex; justify-content: space-between; align-items: center">
          <div>
            <h1 style="margin: 0; font-size: 28px; font-weight: 700">
              Todo List
            </h1>
            <p style="margin: 4px 0 0 0; opacity: 0.7; font-size: 14px">
              Powered by Naive UI
            </p>
          </div>
          <n-button
            circle
            :type="isDark ? 'warning' : 'default'"
            @click="toggleTheme"
            style="width: 40px; height: 40px"
          >
            <template #icon>
              <component :is="isDark ? SunnyOutline : MoonOutline" style="font-size: 20px" />
            </template>
          </n-button>
        </div>
      </n-layout-header>

      <n-layout-content style="padding: 24px">
        <div style="max-width: 800px; margin: 0 auto">
          <n-space vertical :size="24">
            <!-- Statistics Card -->
            <n-card size="small">
              <n-space justify="space-between" align="center">
                <n-space :size="16">
                  <n-tag type="info" size="large" round>
                    Total: {{ stats.total }}
                  </n-tag>
                  <n-tag type="success" size="large" round>
                    Active: {{ stats.active }}
                  </n-tag>
                  <n-tag type="default" size="large" round>
                    Completed: {{ stats.completed }}
                  </n-tag>
                  <n-tag
                    :type="stats.completionRate === 100 ? 'success' : 'warning'"
                    size="large"
                    round
                  >
                    {{ stats.completionRate }}%
                  </n-tag>
                </n-space>
                <n-button
                  v-if="stats.completed > 0"
                  type="error"
                  secondary
                  @click="handleClearCompleted"
                >
                  Clear Completed
                </n-button>
              </n-space>
            </n-card>

            <!-- Input Section -->
            <n-card title="Add New Task" size="small">
              <todo-input @add-todo="handleAddTodo" />
            </n-card>

            <!-- Filter and List Section -->
            <n-card size="small">
              <template #header>
                <n-space justify="space-between" align="center">
                  <span style="font-size: 16px; font-weight: 600">Your Tasks</span>
                  <n-select
                    v-model:value="filter"
                    :options="filterOptions"
                    style="width: 150px"
                    size="small"
                  />
                </n-space>
              </template>

              <todo-list
                :todos="filteredTodos"
                @toggle-todo="handleToggleTodo"
                @delete-todo="handleDeleteTodo"
                @edit-todo="handleEditTodo"
              />
            </n-card>
          </n-space>
        </div>
      </n-layout-content>
    </n-layout>
  </n-config-provider>
</template>

<style scoped>
/* Global styles are handled by Naive UI theme system */
</style>
