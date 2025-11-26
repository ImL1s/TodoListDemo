<template>
  <div class="app">
    <div class="container">
      <h1 class="title">
        <span class="icon">✅</span>
        Vue 3 + TypeScript Todo List
      </h1>

      <TodoInput @add="addTodo" />

      <div class="stats">
        <div class="stat-item">
          <span class="stat-label">總計</span>
          <span class="stat-value">{{ stats.total }}</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">已完成</span>
          <span class="stat-value completed">{{ stats.completed }}</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">未完成</span>
          <span class="stat-value pending">{{ stats.pending }}</span>
        </div>
      </div>

      <TodoList
        :todos="todos"
        @toggle="toggleTodo"
        @delete="deleteTodo"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, computed } from 'vue'
import type { Ref, ComputedRef } from 'vue'
import TodoInput from './components/TodoInput.vue'
import TodoList from './components/TodoList.vue'
import type { Todo } from './types'
import { STORAGE_KEY } from './types'

// 響應式狀態 - 明確指定類型
const todos: Ref<Todo[]> = ref<Todo[]>([])

// 默認數據 - 明確指定類型
const defaultTodos: Todo[] = [
  { id: '1', text: '七點半起床', completed: false },
  { id: '2', text: '洗漱', completed: true },
  { id: '3', text: '去上班', completed: false },
  { id: '4', text: '完成報表', completed: false },
  { id: '5', text: '和小明吃午飯', completed: false },
  { id: '6', text: '去超市', completed: false },
]

// 計算屬性 - 統計信息
interface TodoStats {
  total: number
  completed: number
  pending: number
}

const stats: ComputedRef<TodoStats> = computed<TodoStats>(() => ({
  total: todos.value.length,
  completed: todos.value.filter((todo: Todo) => todo.completed).length,
  pending: todos.value.filter((todo: Todo) => !todo.completed).length,
}))

// 從 localStorage 加載
onMounted(() => {
  const saved: string | null = localStorage.getItem(STORAGE_KEY)
  if (saved) {
    try {
      const parsed: unknown = JSON.parse(saved)
      // 類型守衛 - 確保解析的數據符合 Todo[] 類型
      if (Array.isArray(parsed) && parsed.every(isTodo)) {
        todos.value = parsed
      } else {
        todos.value = defaultTodos
      }
    } catch (error) {
      console.error('Failed to parse todos from localStorage:', error)
      todos.value = defaultTodos
    }
  } else {
    todos.value = defaultTodos
  }
})

// 類型守衛函數
function isTodo(item: unknown): item is Todo {
  return (
    typeof item === 'object' &&
    item !== null &&
    'id' in item &&
    'text' in item &&
    'completed' in item &&
    typeof (item as Todo).id === 'string' &&
    typeof (item as Todo).text === 'string' &&
    typeof (item as Todo).completed === 'boolean'
  )
}

// 監聽 todos 變化，自動保存
watch(
  todos,
  (newTodos: Todo[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newTodos))
  },
  { deep: true }
)

// 添加 todo - 明確的參數和返回類型
const addTodo = (text: string): void => {
  const newTodo: Todo = {
    id: Date.now().toString(),
    text,
    completed: false,
  }
  todos.value.push(newTodo)
}

// 切換完成狀態
const toggleTodo = (id: string): void => {
  const todo: Todo | undefined = todos.value.find((t: Todo) => t.id === id)
  if (todo) {
    todo.completed = !todo.completed
  }
}

// 刪除 todo
const deleteTodo = (id: string): void => {
  todos.value = todos.value.filter((t: Todo) => t.id !== id)
}
</script>

<style scoped>
.app {
  width: 100%;
  padding: 20px;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  min-height: 100vh;
}

.container {
  width: 100%;
  max-width: 600px;
  margin-top: 50px;
}

.title {
  font-size: 2rem;
  font-weight: 700;
  color: #2c3e50;
  text-align: center;
  margin-bottom: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.icon {
  font-size: 2.5rem;
}

.stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  margin-bottom: 2rem;
  padding: 1.5rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}

.stat-label {
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.9);
  font-weight: 500;
}

.stat-value {
  font-size: 2rem;
  font-weight: 700;
  color: white;
}

.stat-value.completed {
  color: #4ade80;
}

.stat-value.pending {
  color: #fbbf24;
}

@media (max-width: 600px) {
  .container {
    margin-top: 20px;
  }

  .app {
    padding: 10px;
  }

  .title {
    font-size: 1.5rem;
  }

  .icon {
    font-size: 2rem;
  }

  .stats {
    padding: 1rem;
    gap: 0.5rem;
  }

  .stat-label {
    font-size: 0.75rem;
  }

  .stat-value {
    font-size: 1.5rem;
  }
}
</style>
