<template>
  <div class="todo-input-container">
    <form @submit.prevent="handleSubmit" class="todo-form">
      <input
        v-model="inputText"
        type="text"
        class="todo-input"
        placeholder="输入待办事项..."
        :disabled="isSubmitting"
      />
      <button
        type="submit"
        class="add-button"
        :disabled="!inputText.trim() || isSubmitting"
      >
        {{ isSubmitting ? '添加中...' : '添加' }}
      </button>
    </form>
  </div>
</template>

<script setup lang="ts">
// Nuxt 3 自动导入 ref, computed 等 Vue API
const inputText = ref('')
const isSubmitting = ref(false)

const handleSubmit = async () => {
  if (!inputText.value.trim() || isSubmitting.value) return

  isSubmitting.value = true

  try {
    // 使用 Nuxt 3 的 $fetch 工具（自动导入）
    await $fetch('/api/todos', {
      method: 'POST',
      body: { text: inputText.value.trim() }
    })

    // 清空输入框
    inputText.value = ''

    // 触发自定义事件，通知 TodoList 刷新
    // 在浏览器环境中
    if (process.client) {
      window.dispatchEvent(new Event('todosUpdated'))
    }
  } catch (error) {
    console.error('添加 todo 失败:', error)
    alert('添加失败，请重试')
  } finally {
    isSubmitting.value = false
  }
}
</script>

<style scoped>
.todo-input-container {
  margin-bottom: 2rem;
  animation: fadeInUp 0.6s ease-out 0.2s both;
}

.todo-form {
  display: flex;
  gap: 0.75rem;
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08);
}

.todo-input {
  flex: 1;
  padding: 0.875rem 1rem;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.2s;
  outline: none;
}

.todo-input:focus {
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.todo-input:disabled {
  background-color: #f3f4f6;
  cursor: not-allowed;
}

.add-button {
  padding: 0.875rem 1.75rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
}

.add-button:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.add-button:active:not(:disabled) {
  transform: translateY(0);
}

.add-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
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
  .todo-form {
    padding: 1rem;
    gap: 0.5rem;
  }

  .todo-input {
    padding: 0.75rem 0.875rem;
    font-size: 0.95rem;
  }

  .add-button {
    padding: 0.75rem 1.25rem;
    font-size: 0.95rem;
  }
}

@media (max-width: 400px) {
  .todo-form {
    flex-direction: column;
  }

  .add-button {
    width: 100%;
  }
}
</style>
