<template>
  <div class="app">
    <div class="container">
      <TodoInput @add="addTodo" />
      <TodoList
        :todos="todos"
        @toggle="toggleTodo"
        @delete="deleteTodo"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import TodoInput from './components/TodoInput.vue'
import TodoList from './components/TodoList.vue'

// 響應式狀態
const todos = ref([])

// 默認數據
const defaultTodos = [
  { id: '1', text: '七點半起床', completed: false },
  { id: '2', text: '洗漱', completed: true },
  { id: '3', text: '去上班', completed: false },
  { id: '4', text: '完成報表', completed: false },
  { id: '5', text: '和小明吃午飯', completed: false },
  { id: '6', text: '去超市', completed: false },
]

// 從 localStorage 加載
onMounted(() => {
  const saved = localStorage.getItem('vue3-todos')
  todos.value = saved ? JSON.parse(saved) : defaultTodos
})

// 監聽 todos 變化，自動保存
watch(todos, (newTodos) => {
  localStorage.setItem('vue3-todos', JSON.stringify(newTodos))
}, { deep: true })

// 添加 todo
const addTodo = (text) => {
  const newTodo = {
    id: Date.now().toString(),
    text,
    completed: false
  }
  todos.value.push(newTodo)
}

// 切換完成狀態
const toggleTodo = (id) => {
  const todo = todos.value.find(t => t.id === id)
  if (todo) {
    todo.completed = !todo.completed
  }
}

// 刪除 todo
const deleteTodo = (id) => {
  todos.value = todos.value.filter(t => t.id !== id)
}
</script>

<style scoped>
.app {
  width: 100%;
  padding: 20px;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  min-height: 100vh;
}

.container {
  width: 100%;
  max-width: 600px;
  margin-top: 50px;
}

@media (max-width: 600px) {
  .container {
    margin-top: 20px;
  }

  .app {
    padding: 10px;
  }
}
</style>
