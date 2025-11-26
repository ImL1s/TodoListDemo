<script setup lang="ts">
import { useTodoStore } from '../stores/useTodoStore'
import TodoItem from './TodoItem.vue'

const todoStore = useTodoStore()
</script>

<template>
  <div class="todo-list-container">
    <div v-if="todoStore.filteredTodos.length === 0" class="empty-state">
      <p class="empty-message">
        {{ todoStore.filter === 'all' ? '目前沒有待辦事項' : `沒有${todoStore.filter === 'active' ? '進行中' : '已完成'}的事項` }}
      </p>
    </div>

    <ul v-else class="todo-list">
      <TodoItem
        v-for="todo in todoStore.filteredTodos"
        :key="todo.id"
        :todo="todo"
      />
    </ul>
  </div>
</template>

<style scoped>
.todo-list-container {
  margin-bottom: 1.5rem;
}

.todo-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.empty-state {
  text-align: center;
  padding: 3rem 1rem;
  background: #f7fafc;
  border-radius: 0.5rem;
  border: 2px dashed #cbd5e0;
}

.empty-message {
  color: #a0aec0;
  font-size: 1.1rem;
  margin: 0;
}
</style>
