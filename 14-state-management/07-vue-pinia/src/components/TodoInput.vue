<script setup lang="ts">
import { ref } from 'vue'
import { useTodoStore } from '../stores/useTodoStore'

const todoStore = useTodoStore()
const newTodo = ref('')

const handleSubmit = () => {
  if (newTodo.value.trim()) {
    todoStore.addTodo(newTodo.value)
    newTodo.value = ''
  }
}
</script>

<template>
  <div class="todo-input-container">
    <form @submit.prevent="handleSubmit" class="todo-form">
      <input
        v-model="newTodo"
        type="text"
        class="todo-input"
        placeholder="輸入待辦事項..."
        @keyup.enter="handleSubmit"
      />
      <button type="submit" class="add-button">
        新增
      </button>
    </form>
  </div>
</template>

<style scoped>
.todo-input-container {
  margin-bottom: 2rem;
}

.todo-form {
  display: flex;
  gap: 0.5rem;
}

.todo-input {
  flex: 1;
  padding: 0.75rem 1rem;
  font-size: 1rem;
  border: 2px solid #e2e8f0;
  border-radius: 0.5rem;
  outline: none;
  transition: all 0.2s;
}

.todo-input:focus {
  border-color: #42b883;
  box-shadow: 0 0 0 3px rgba(66, 184, 131, 0.1);
}

.add-button {
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  font-weight: 600;
  color: white;
  background: linear-gradient(135deg, #42b883 0%, #35495e 100%);
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.2s;
}

.add-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(66, 184, 131, 0.3);
}

.add-button:active {
  transform: translateY(0);
}
</style>
