<template>
  <ion-list v-if="todos.length > 0" class="todo-list">
    <TodoItem
      v-for="todo in todos"
      :key="todo.id"
      :todo="todo"
      @toggle="$emit('toggle-todo', todo.id)"
      @delete="$emit('delete-todo', todo.id)"
    />
  </ion-list>
</template>

<script setup lang="ts">
import { IonList } from '@ionic/vue'
import TodoItem from './TodoItem.vue'
import type { Todo } from '@/types'

// Props
defineProps<{
  todos: Todo[]
}>()

// Emits
defineEmits<{
  (e: 'toggle-todo', id: number): void
  (e: 'delete-todo', id: number): void
}>()
</script>

<style scoped>
.todo-list {
  padding: 0 16px;
}
</style>
