<template>
  <div class="todo-input-container">
    <input
      ref="inputRef"
      v-model="inputText"
      @keyup.enter="handleAdd"
      type="text"
      class="todo-input"
      placeholder="添加新的待办事项... (按 Enter 添加)"
      maxlength="200"
    />
    <button @click="handleAdd" class="add-button" :disabled="!inputText.trim()">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
      </svg>
    </button>
    <div class="char-count" v-if="inputText.length > 0">
      {{ inputText.length }}/200
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

// Emits
const emit = defineEmits<{
  (e: 'add-todo', text: string): void;
}>();

// 响应式状态
const inputText = ref('');
const inputRef = ref<HTMLInputElement | null>(null);

// 添加待办事项
function handleAdd() {
  const text = inputText.value.trim();
  if (text) {
    emit('add-todo', text);
    inputText.value = '';
    inputRef.value?.focus();
  }
}

// 聚焦输入框（暴露给父组件）
function focus() {
  inputRef.value?.focus();
}

// 暴露方法给父组件
defineExpose({
  focus,
});
</script>

<style scoped>
.todo-input-container {
  position: relative;
  margin-bottom: 1.5rem;
}

.todo-input {
  width: 100%;
  padding: 1rem 3.5rem 1rem 1rem;
  font-size: 1rem;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  outline: none;
  transition: all 0.3s;
  font-family: inherit;
}

.todo-input:focus {
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.add-button {
  position: absolute;
  right: 0.5rem;
  top: 50%;
  transform: translateY(-50%);
  width: 40px;
  height: 40px;
  border: none;
  border-radius: 6px;
  background: #667eea;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s;
}

.add-button:hover:not(:disabled) {
  background: #5568d3;
  transform: translateY(-50%) scale(1.05);
}

.add-button:disabled {
  background: #ccc;
  cursor: not-allowed;
  opacity: 0.5;
}

.add-button svg {
  width: 24px;
  height: 24px;
}

.char-count {
  position: absolute;
  right: 60px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 0.8rem;
  color: #999;
}

@media (max-width: 768px) {
  .todo-input {
    padding: 0.875rem 3.5rem 0.875rem 0.875rem;
    font-size: 0.95rem;
  }
}
</style>
