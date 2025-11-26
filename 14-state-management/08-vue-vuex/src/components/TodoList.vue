<script setup lang="ts">
import { Todo } from '../types'
import TodoItem from './TodoItem.vue'

// Props
defineProps<{
  todos: Todo[]
}>()
</script>

<template>
  <div class="todo-list">
    <div v-if="todos.length === 0" class="empty-state">
      <p>🎉 No todos here! Time to relax or add a new task.</p>
    </div>
    <TransitionGroup name="list" tag="div">
      <TodoItem
        v-for="todo in todos"
        :key="todo.id"
        :todo="todo"
      />
    </TransitionGroup>
  </div>
</template>

<style scoped>
.todo-list {
  min-height: 100px;
}

.empty-state {
  text-align: center;
  padding: 3rem 1rem;
  color: #718096;
  font-size: 1rem;
}

.empty-state p {
  margin: 0;
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
