<template>
  <div class="todo-item" :class="{ completed: todo.completed }">
    <input
      type="checkbox"
      :checked="todo.completed"
      @change="handleToggle"
      :disabled="isUpdating"
      class="todo-checkbox"
      :id="`todo-${todo.id}`"
    />
    <label :for="`todo-${todo.id}`" class="todo-text">
      {{ todo.text }}
    </label>
    <button
      @click="handleDelete"
      :disabled="isDeleting"
      class="delete-button"
      :aria-label="`删除任务: ${todo.text}`"
    >
      {{ isDeleting ? '...' : '×' }}
    </button>
  </div>
</template>

<script setup lang="ts">
// 定义 props 类型
interface Todo {
  id: number
  text: string
  completed: boolean
  createdAt: string
}

interface Props {
  todo: Todo
}

const props = defineProps<Props>()

const isUpdating = ref(false)
const isDeleting = ref(false)

const handleToggle = async () => {
  if (isUpdating.value) return

  isUpdating.value = true

  try {
    await $fetch('/api/todos', {
      method: 'PATCH',
      body: { id: props.todo.id }
    })

    // 触发更新事件
    if (process.client) {
      window.dispatchEvent(new Event('todosUpdated'))
    }
  } catch (error) {
    console.error('更新 todo 失败:', error)
    alert('更新失败，请重试')
  } finally {
    isUpdating.value = false
  }
}

const handleDelete = async () => {
  if (isDeleting.value) return

  isDeleting.value = true

  try {
    await $fetch('/api/todos', {
      method: 'DELETE',
      query: { id: props.todo.id }
    })

    // 触发更新事件
    if (process.client) {
      window.dispatchEvent(new Event('todosUpdated'))
    }
  } catch (error) {
    console.error('删除 todo 失败:', error)
    alert('删除失败，请重试')
  } finally {
    isDeleting.value = false
  }
}
</script>

<style scoped>
.todo-item {
  display: flex;
  align-items: center;
  padding: 1rem 1.25rem;
  background: white;
  border-radius: 8px;
  margin-bottom: 0.75rem;
  transition: all 0.2s;
  animation: slideIn 0.3s ease-out;
  border: 2px solid transparent;
}

.todo-item:hover {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  border-color: #e5e7eb;
}

.todo-item.completed {
  opacity: 0.7;
  background: #f9fafb;
}

.todo-checkbox {
  width: 20px;
  height: 20px;
  cursor: pointer;
  margin-right: 1rem;
  flex-shrink: 0;
}

.todo-checkbox:disabled {
  cursor: not-allowed;
}

.todo-text {
  flex: 1;
  font-size: 1rem;
  cursor: pointer;
  user-select: none;
  transition: all 0.2s;
}

.completed .todo-text {
  text-decoration: line-through;
  color: #9ca3af;
}

.delete-button {
  width: 32px;
  height: 32px;
  border: none;
  background: #fee;
  color: #dc2626;
  border-radius: 6px;
  font-size: 1.5rem;
  line-height: 1;
  cursor: pointer;
  transition: all 0.2s;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 300;
}

.delete-button:hover:not(:disabled) {
  background: #fca5a5;
  color: white;
  transform: scale(1.1);
}

.delete-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateX(-10px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@media (max-width: 640px) {
  .todo-item {
    padding: 0.875rem 1rem;
  }

  .todo-text {
    font-size: 0.95rem;
  }

  .todo-checkbox {
    width: 18px;
    height: 18px;
    margin-right: 0.75rem;
  }

  .delete-button {
    width: 28px;
    height: 28px;
    font-size: 1.25rem;
  }
}
</style>
