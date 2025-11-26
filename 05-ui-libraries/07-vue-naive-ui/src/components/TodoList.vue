<script setup lang="ts">
import { NSpace, NEmpty } from 'naive-ui'
import { DocumentTextOutline } from '@vicons/ionicons5'
import TodoItem from './TodoItem.vue'
import type { Todo } from '../types'

// Props
interface Props {
  todos: Todo[]
}

defineProps<Props>()

// Emits
const emit = defineEmits<{
  toggleTodo: [id: string]
  deleteTodo: [id: string]
  editTodo: [id: string, newText: string]
}>()

// Handle toggle
const handleToggle = (id: string) => {
  emit('toggleTodo', id)
}

// Handle delete
const handleDelete = (id: string) => {
  emit('deleteTodo', id)
}

// Handle edit
const handleEdit = (id: string, newText: string) => {
  emit('editTodo', id, newText)
}
</script>

<template>
  <div class="todo-list-container">
    <n-space v-if="todos.length > 0" vertical :size="12">
      <todo-item
        v-for="todo in todos"
        :key="todo.id"
        :todo="todo"
        @toggle="handleToggle"
        @delete="handleDelete"
        @edit="handleEdit"
      />
    </n-space>

    <n-empty
      v-else
      description="No tasks found"
      size="large"
      style="padding: 60px 0"
    >
      <template #icon>
        <n-icon :component="DocumentTextOutline" size="48" />
      </template>
      <template #extra>
        <p style="margin-top: 8px; opacity: 0.6">
          Add your first task to get started!
        </p>
      </template>
    </n-empty>
  </div>
</template>

<style scoped>
.todo-list-container {
  min-height: 200px;
}
</style>
