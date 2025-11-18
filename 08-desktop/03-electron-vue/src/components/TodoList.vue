<template>
  <div class="todo-list">
    <transition-group name="list" tag="div">
      <TodoItem
        v-for="todo in todos"
        :key="todo.id"
        :todo="todo"
        @toggle="$emit('toggle-todo', $event)"
        @delete="$emit('delete-todo', $event)"
        @edit="$emit('edit-todo', $event.id, $event.text)"
      />
    </transition-group>
  </div>
</template>

<script setup lang="ts">
import TodoItem from './TodoItem.vue';
import type { Todo } from '../types';

// Props
defineProps<{
  todos: Todo[];
}>();

// Emits
defineEmits<{
  (e: 'toggle-todo', id: number): void;
  (e: 'delete-todo', id: number): void;
  (e: 'edit-todo', id: number, text: string): void;
}>();
</script>

<style scoped>
.todo-list {
  min-height: 100px;
}

/* 列表动画 */
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
