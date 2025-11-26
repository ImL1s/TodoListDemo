<script setup lang="ts">
import { useTodoStore } from '@/stores/useTodoStore'
import { storeToRefs } from 'pinia'
import TodoItem from './TodoItem.vue'

const todoStore = useTodoStore()

// 使用 storeToRefs 保持響應性
const { filteredTodos } = storeToRefs(todoStore)
</script>

<template>
  <div class="todo-list-container">
    <TransitionGroup name="list" tag="div" class="todo-list">
      <TodoItem v-for="todo in filteredTodos" :key="todo.id" :todo="todo" />
    </TransitionGroup>

    <div v-if="filteredTodos.length === 0" class="empty-state">
      <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path
          d="M9 11l3 3L22 4"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
      <p>沒有待辦事項</p>
    </div>
  </div>
</template>

<style scoped>
.todo-list-container {
  margin-bottom: 1.5rem;
}

.todo-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem 1rem;
  color: #9ca3af;
}

.empty-state svg {
  margin-bottom: 1rem;
  opacity: 0.5;
}

.empty-state p {
  font-size: 1.125rem;
}

/* List transition animations */
.list-enter-active,
.list-leave-active {
  transition: all 0.3s ease;
}

.list-enter-from {
  opacity: 0;
  transform: translateX(-30px);
}

.list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

.list-move {
  transition: transform 0.3s ease;
}
</style>
