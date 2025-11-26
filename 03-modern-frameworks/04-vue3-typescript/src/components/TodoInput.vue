<template>
  <div class="todo-input-container">
    <form @submit.prevent="handleSubmit" class="todo-input-form">
      <input
        v-model="inputText"
        type="text"
        class="todo-input"
        placeholder="輸入新的待辦事項..."
        :maxlength="maxLength"
        ref="inputRef"
      />
      <button
        type="submit"
        class="add-button"
        :disabled="!inputText.trim()"
      >
        <span class="button-icon">+</span>
        <span class="button-text">添加</span>
      </button>
    </form>
    <div v-if="inputText.length > 0" class="char-count">
      {{ inputText.length }} / {{ maxLength }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type { Ref } from 'vue'
import type { TodoInputEmits } from '../types'

// 定義 emits - 使用類型定義
const emit = defineEmits<TodoInputEmits>()

// 響應式狀態 - 明確類型
const inputText: Ref<string> = ref<string>('')
const inputRef: Ref<HTMLInputElement | null> = ref<HTMLInputElement | null>(null)

// 常量 - 使用 const 斷言
const maxLength = 100 as const

// 提交處理
const handleSubmit = (): void => {
  const text: string = inputText.value.trim()
  if (text) {
    emit('add', text)
    inputText.value = ''
    // 提交後重新聚焦輸入框
    inputRef.value?.focus()
  }
}

// 組件掛載後自動聚焦
onMounted(() => {
  inputRef.value?.focus()
})
</script>

<style scoped>
.todo-input-container {
  margin-bottom: 2rem;
}

.todo-input-form {
  display: flex;
  gap: 0.75rem;
  margin-bottom: 0.5rem;
}

.todo-input {
  flex: 1;
  padding: 0.875rem 1rem;
  font-size: 1rem;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  outline: none;
  transition: all 0.3s ease;
  font-family: inherit;
}

.todo-input:focus {
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.todo-input::placeholder {
  color: #a0aec0;
}

.add-button {
  padding: 0.875rem 1.5rem;
  font-size: 1rem;
  font-weight: 600;
  color: white;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
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
  opacity: 0.5;
  cursor: not-allowed;
}

.button-icon {
  font-size: 1.25rem;
  font-weight: 700;
}

.char-count {
  font-size: 0.875rem;
  color: #718096;
  text-align: right;
  padding-right: 0.5rem;
}

@media (max-width: 600px) {
  .todo-input-form {
    gap: 0.5rem;
  }

  .todo-input,
  .add-button {
    padding: 0.75rem 1rem;
    font-size: 0.9375rem;
  }

  .button-text {
    display: none;
  }

  .button-icon {
    font-size: 1.5rem;
  }

  .add-button {
    padding: 0.75rem 1.25rem;
  }
}
</style>
