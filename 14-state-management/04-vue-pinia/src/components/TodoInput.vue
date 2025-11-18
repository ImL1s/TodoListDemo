<script setup lang="ts">
import { ref } from 'vue'
import { useTodoStore } from '@/stores/useTodoStore'

const todoStore = useTodoStore()
const newTodoText = ref('')

const handleSubmit = () => {
  if (newTodoText.value.trim()) {
    todoStore.addTodo(newTodoText.value)
    newTodoText.value = ''
  }
}
</script>

<template>
  <div class="todo-input-container">
    <form @submit.prevent="handleSubmit">
      <input
        v-model="newTodoText"
        type="text"
        class="todo-input"
        placeholder="新增待辦事項..."
        autofocus
      />
      <button type="submit" class="add-button">新增</button>
    </form>
  </div>
</template>

<style scoped>
.todo-input-container {
  margin-bottom: 2rem;
}

form {
  display: flex;
  gap: 0.75rem;
}

.todo-input {
  flex: 1;
  padding: 0.875rem 1rem;
  font-size: 1rem;
  border: 2px solid #e5e7eb;
  border-radius: 0.5rem;
  transition: all 0.2s;
  background: white;
}

.todo-input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.add-button {
  padding: 0.875rem 1.75rem;
  font-size: 1rem;
  font-weight: 500;
  color: white;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
}

.add-button:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.add-button:active {
  transform: translateY(0);
}
</style>
