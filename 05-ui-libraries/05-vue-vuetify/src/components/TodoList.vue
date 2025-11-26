<template>
  <v-card elevation="2">
    <v-card-text v-if="todos.length === 0" class="text-center text-grey py-8">
      <v-icon size="64" color="grey-lighten-1">mdi-checkbox-blank-circle-outline</v-icon>
      <p class="text-h6 mt-4">No todos yet</p>
      <p class="text-body-2">Add a new todo to get started!</p>
    </v-card-text>

    <v-list v-else lines="two">
      <template v-for="(todo, index) in todos" :key="todo.id">
        <TodoItem
          :todo="todo"
          @toggle="emit('toggle', $event)"
          @delete="emit('delete', $event)"
        />
        <v-divider v-if="index < todos.length - 1"></v-divider>
      </template>
    </v-list>
  </v-card>
</template>

<script setup lang="ts">
import type { Todo } from '../types'
import TodoItem from './TodoItem.vue'

defineProps<{
  todos: Todo[]
}>()

const emit = defineEmits<{
  toggle: [id: number]
  delete: [id: number]
}>()
</script>
