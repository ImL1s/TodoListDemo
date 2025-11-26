<template>
  <ul class="todo-list">
    <li v-if="todos.length === 0" class="empty-state">
      還沒有任務，添加一個吧！
    </li>
    <TodoItem
      v-for="todo in todos"
      :key="todo.id"
      :todo="todo"
      @toggle="$emit('toggle', $event)"
      @delete="$emit('delete', $event)"
    />
  </ul>
</template>

<script setup>
import TodoItem from './TodoItem.vue'

// 定義 props
defineProps({
  todos: {
    type: Array,
    required: true
  }
})

// 定義 emits
defineEmits(['toggle', 'delete'])
</script>

<style scoped>
.todo-list {
  list-style: none;
  margin: 0;
  padding: 0;
  background: white;
  border-radius: 0 0 10px 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.empty-state {
  padding: 40px;
  text-align: center;
  color: #999;
  font-style: italic;
  background: white;
}
</style>
