<template>
  <div class="todo-list">
    <div v-if="loading" class="loading">
      Loading todos...
    </div>
    <div v-else-if="todos.length === 0" class="empty-state">
      <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="9 11 12 14 22 4"></polyline>
        <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>
      </svg>
      <p>{{ emptyMessage }}</p>
    </div>
    <div v-else class="list-container">
      <transition-group name="todo-list" tag="div">
        <TodoItem
          v-for="todo in todos"
          :key="todo.id"
          :todo="todo"
          @toggle="$emit('toggle', $event)"
          @delete="$emit('delete', $event)"
          @update="$emit('update', $event, arguments[1])"
        />
      </transition-group>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import TodoItem from './TodoItem.vue'
import type { Todo, FilterType } from '../types'

const props = defineProps<{
  todos: Todo[]
  filter: FilterType
  loading?: boolean
}>()

defineEmits<{
  toggle: [id: string]
  delete: [id: string]
  update: [id: string, text: string]
}>()

const emptyMessage = computed(() => {
  switch (props.filter) {
    case 'active':
      return 'No active todos. Great job!'
    case 'completed':
      return 'No completed todos yet.'
    default:
      return 'No todos yet. Add one above!'
  }
})
</script>

<style scoped>
.todo-list {
  min-height: 200px;
}

.loading {
  text-align: center;
  padding: 40px;
  color: #999;
  font-style: italic;
}

.empty-state {
  text-align: center;
  padding: 60px 20px;
  color: #999;
}

.empty-state svg {
  margin-bottom: 20px;
  opacity: 0.5;
}

.empty-state p {
  font-size: 18px;
  font-style: italic;
}

.list-container {
  margin-top: 20px;
}

/* Transition animations */
.todo-list-enter-active,
.todo-list-leave-active {
  transition: all 0.3s ease;
}

.todo-list-enter-from {
  opacity: 0;
  transform: translateX(-30px);
}

.todo-list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

.todo-list-move {
  transition: transform 0.3s ease;
}
</style>
