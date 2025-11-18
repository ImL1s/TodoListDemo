<template>
  <v-list-item
    :class="{ 'bg-grey-lighten-4': todo.completed }"
    @click="emit('toggle', todo.id)"
  >
    <template v-slot:prepend>
      <v-checkbox
        :model-value="todo.completed"
        color="primary"
        hide-details
        @click.stop="emit('toggle', todo.id)"
      ></v-checkbox>
    </template>

    <v-list-item-title
      :class="{ 'text-decoration-line-through text-grey': todo.completed }"
    >
      {{ todo.text }}
    </v-list-item-title>

    <v-list-item-subtitle class="text-caption">
      {{ formatDate(todo.createdAt) }}
    </v-list-item-subtitle>

    <template v-slot:append>
      <v-btn
        icon="mdi-delete"
        variant="text"
        color="error"
        size="small"
        @click.stop="emit('delete', todo.id)"
      ></v-btn>
    </template>
  </v-list-item>
</template>

<script setup lang="ts">
import type { Todo } from '../types'

defineProps<{
  todo: Todo
}>()

const emit = defineEmits<{
  toggle: [id: number]
  delete: [id: number]
}>()

const formatDate = (date: Date) => {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}
</script>
