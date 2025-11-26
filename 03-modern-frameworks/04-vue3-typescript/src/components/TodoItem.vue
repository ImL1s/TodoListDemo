<template>
  <div
    class="todo-item"
    :class="{ completed: todo.completed }"
  >
    <div class="todo-content">
      <button
        class="checkbox"
        :class="{ checked: todo.completed }"
        @click="handleToggle"
        :aria-label="todo.completed ? '標記為未完成' : '標記為已完成'"
      >
        <span v-if="todo.completed" class="checkmark">✓</span>
      </button>

      <span class="todo-text">{{ todo.text }}</span>
    </div>

    <button
      class="delete-button"
      @click="handleDelete"
      aria-label="刪除待辦事項"
    >
      <span class="delete-icon">×</span>
    </button>
  </div>
</template>

<script setup lang="ts">
import type { TodoItemProps, TodoItemEmits } from '../types'

// 定義 props - 使用泛型和類型定義
const props = defineProps<TodoItemProps>()

// 定義 emits - 使用類型定義
const emit = defineEmits<TodoItemEmits>()

// 事件處理函數 - 明確的類型標註
const handleToggle = (): void => {
  emit('toggle', props.todo.id)
}

const handleDelete = (): void => {
  emit('delete', props.todo.id)
}
</script>

<style scoped>
.todo-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 1.25rem;
  background: white;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  transition: all 0.3s ease;
  gap: 1rem;
}

.todo-item:hover {
  border-color: #cbd5e0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  transform: translateY(-1px);
}

.todo-item.completed {
  background: #f7fafc;
  border-color: #e2e8f0;
}

.todo-content {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 0.875rem;
  min-width: 0;
}

.checkbox {
  width: 24px;
  height: 24px;
  min-width: 24px;
  border: 2px solid #cbd5e0;
  border-radius: 6px;
  background: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  padding: 0;
}

.checkbox:hover {
  border-color: #667eea;
  transform: scale(1.1);
}

.checkbox.checked {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-color: #667eea;
}

.checkmark {
  color: white;
  font-size: 1rem;
  font-weight: 700;
  line-height: 1;
}

.todo-text {
  flex: 1;
  font-size: 1rem;
  color: #2d3748;
  word-break: break-word;
  transition: all 0.3s ease;
}

.todo-item.completed .todo-text {
  color: #a0aec0;
  text-decoration: line-through;
}

.delete-button {
  width: 32px;
  height: 32px;
  min-width: 32px;
  border: none;
  background: #fee;
  color: #f56565;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  padding: 0;
  opacity: 0;
}

.todo-item:hover .delete-button {
  opacity: 1;
}

.delete-button:hover {
  background: #f56565;
  color: white;
  transform: scale(1.1);
}

.delete-icon {
  font-size: 1.5rem;
  font-weight: 700;
  line-height: 1;
}

@media (max-width: 600px) {
  .todo-item {
    padding: 0.875rem 1rem;
  }

  .todo-text {
    font-size: 0.9375rem;
  }

  .delete-button {
    opacity: 1;
  }
}
</style>
