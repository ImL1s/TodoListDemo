<template>
  <div class="todo-list-container">
    <div v-if="todos.length === 0" class="empty-state">
      <div class="empty-icon">📝</div>
      <p class="empty-text">還沒有待辦事項</p>
      <p class="empty-hint">添加一個新的待辦事項開始吧！</p>
    </div>

    <TransitionGroup
      v-else
      name="todo-list"
      tag="div"
      class="todo-list"
    >
      <TodoItem
        v-for="todo in todos"
        :key="todo.id"
        :todo="todo"
        @toggle="handleToggle"
        @delete="handleDelete"
      />
    </TransitionGroup>
  </div>
</template>

<script setup lang="ts">
import TodoItem from './TodoItem.vue'
import type { TodoListProps, TodoListEmits } from '../types'

// 定義 props - 使用泛型和類型定義
const props = defineProps<TodoListProps>()

// 定義 emits - 使用類型定義
const emit = defineEmits<TodoListEmits>()

// 事件處理函數 - 明確的類型標註
const handleToggle = (id: string): void => {
  emit('toggle', id)
}

const handleDelete = (id: string): void => {
  emit('delete', id)
}
</script>

<style scoped>
.todo-list-container {
  min-height: 200px;
}

.empty-state {
  text-align: center;
  padding: 3rem 1rem;
  color: #a0aec0;
}

.empty-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
  opacity: 0.5;
}

.empty-text {
  font-size: 1.25rem;
  font-weight: 600;
  color: #4a5568;
  margin-bottom: 0.5rem;
}

.empty-hint {
  font-size: 0.9375rem;
  color: #718096;
}

.todo-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

/* Vue 過渡動畫 */
.todo-list-move,
.todo-list-enter-active,
.todo-list-leave-active {
  transition: all 0.3s ease;
}

.todo-list-enter-from {
  opacity: 0;
  transform: translateX(-30px);
}

.todo-list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

.todo-list-leave-active {
  position: absolute;
  width: 100%;
}

@media (max-width: 600px) {
  .empty-icon {
    font-size: 3rem;
  }

  .empty-text {
    font-size: 1.125rem;
  }

  .empty-hint {
    font-size: 0.875rem;
  }
}
</style>
