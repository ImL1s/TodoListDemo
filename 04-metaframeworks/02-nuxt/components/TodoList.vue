<template>
  <div class="todo-list-container">
    <!-- 过滤器 -->
    <div class="filter-container">
      <button
        v-for="filterOption in filters"
        :key="filterOption.value"
        @click="currentFilter = filterOption.value"
        :class="['filter-button', { active: currentFilter === filterOption.value }]"
      >
        {{ filterOption.label }}
      </button>
    </div>

    <!-- 加载状态 -->
    <div v-if="isLoading" class="loading">
      <div class="spinner"></div>
      <p>加载中...</p>
    </div>

    <!-- 错误状态 -->
    <div v-else-if="error" class="error">
      <p>{{ error }}</p>
      <button @click="fetchTodos" class="retry-button">重试</button>
    </div>

    <!-- Todo 列表 -->
    <div v-else-if="filteredTodos.length > 0" class="todo-list">
      <TodoItem
        v-for="todo in filteredTodos"
        :key="todo.id"
        :todo="todo"
      />
    </div>

    <!-- 空状态 -->
    <div v-else class="empty-state">
      <p>{{ emptyMessage }}</p>
    </div>

    <!-- 统计信息 -->
    <div v-if="todos.length > 0" class="stats">
      <span>总计: {{ todos.length }}</span>
      <span>进行中: {{ activeTodosCount }}</span>
      <span>已完成: {{ completedTodosCount }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
// 定义 Todo 类型
interface Todo {
  id: number
  text: string
  completed: boolean
  createdAt: string
}

type FilterType = 'all' | 'active' | 'completed'

// 响应式状态
const todos = ref<Todo[]>([])
const isLoading = ref(true)
const error = ref<string | null>(null)
const currentFilter = ref<FilterType>('all')

// 过滤器选项
const filters = [
  { value: 'all' as FilterType, label: '全部' },
  { value: 'active' as FilterType, label: '进行中' },
  { value: 'completed' as FilterType, label: '已完成' }
]

// 计算属性
const filteredTodos = computed(() => {
  switch (currentFilter.value) {
    case 'active':
      return todos.value.filter(todo => !todo.completed)
    case 'completed':
      return todos.value.filter(todo => todo.completed)
    default:
      return todos.value
  }
})

const activeTodosCount = computed(() =>
  todos.value.filter(todo => !todo.completed).length
)

const completedTodosCount = computed(() =>
  todos.value.filter(todo => todo.completed).length
)

const emptyMessage = computed(() => {
  if (todos.value.length === 0) {
    return '还没有待办事项，添加一个吧！'
  }
  switch (currentFilter.value) {
    case 'active':
      return '没有进行中的待办事项'
    case 'completed':
      return '还没有完成任何待办事项'
    default:
      return '列表为空'
  }
})

// 获取 todos
const fetchTodos = async () => {
  isLoading.value = true
  error.value = null

  try {
    const data = await $fetch<Todo[]>('/api/todos')
    todos.value = data
  } catch (err) {
    console.error('获取 todos 失败:', err)
    error.value = '加载失败，请重试'
  } finally {
    isLoading.value = false
  }
}

// 监听更新事件
const handleTodosUpdate = () => {
  fetchTodos()
}

// 组件挂载时获取数据
onMounted(() => {
  fetchTodos()

  // 监听自定义事件
  if (process.client) {
    window.addEventListener('todosUpdated', handleTodosUpdate)
  }
})

// 组件卸载时清理
onUnmounted(() => {
  if (process.client) {
    window.removeEventListener('todosUpdated', handleTodosUpdate)
  }
})
</script>

<style scoped>
.todo-list-container {
  animation: fadeInUp 0.6s ease-out 0.3s both;
}

.filter-container {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
  background: white;
  padding: 0.5rem;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.08);
}

.filter-button {
  flex: 1;
  padding: 0.75rem 1rem;
  border: 2px solid transparent;
  background: transparent;
  color: #6b7280;
  border-radius: 6px;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.filter-button:hover {
  background: #f3f4f6;
  color: #374151;
}

.filter-button.active {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-color: transparent;
}

.loading,
.error,
.empty-state {
  text-align: center;
  padding: 3rem 2rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
}

.loading p,
.error p,
.empty-state p {
  color: #6b7280;
  font-size: 1.1rem;
  margin: 0;
}

.spinner {
  width: 40px;
  height: 40px;
  margin: 0 auto 1rem;
  border: 4px solid #e5e7eb;
  border-top-color: #667eea;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.error p {
  color: #dc2626;
  margin-bottom: 1rem;
}

.retry-button {
  padding: 0.75rem 1.5rem;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.retry-button:hover {
  background: #5568d3;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.todo-list {
  margin-bottom: 1.5rem;
}

.stats {
  display: flex;
  justify-content: space-around;
  padding: 1rem;
  background: white;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.08);
  font-size: 0.9rem;
  color: #6b7280;
  font-weight: 600;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 640px) {
  .filter-container {
    padding: 0.375rem;
    gap: 0.375rem;
  }

  .filter-button {
    padding: 0.625rem 0.75rem;
    font-size: 0.875rem;
  }

  .stats {
    flex-direction: column;
    gap: 0.5rem;
    text-align: center;
  }
}
</style>
