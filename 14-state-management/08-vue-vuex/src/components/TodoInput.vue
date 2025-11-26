<script setup lang="ts">
import { ref } from 'vue'
import { useStore } from '../store'

const store = useStore()
const newTodo = ref('')

const addTodo = () => {
  if (newTodo.value.trim()) {
    // Dispatch action to add todo
    store.dispatch('addTodo', newTodo.value)
    newTodo.value = ''
  }
}

const handleKeyPress = (e: KeyboardEvent) => {
  if (e.key === 'Enter') {
    addTodo()
  }
}
</script>

<template>
  <div class="todo-input-container">
    <input
      v-model="newTodo"
      type="text"
      class="todo-input"
      placeholder="What needs to be done?"
      @keypress="handleKeyPress"
    />
    <button
      class="add-button"
      @click="addTodo"
      :disabled="!newTodo.trim()"
    >
      Add
    </button>
  </div>
</template>

<style scoped>
.todo-input-container {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
}

.todo-input {
  flex: 1;
  padding: 0.875rem 1rem;
  font-size: 1rem;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  outline: none;
  transition: all 0.2s;
}

.todo-input:focus {
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
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
  transition: all 0.2s;
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
</style>
