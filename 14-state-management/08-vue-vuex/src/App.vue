<script setup lang="ts">
import { computed } from 'vue'
import { useStore } from './store'
import TodoInput from './components/TodoInput.vue'
import TodoFilter from './components/TodoFilter.vue'
import TodoList from './components/TodoList.vue'
import TodoStats from './components/TodoStats.vue'

const store = useStore()

// Using getters from the store
const filteredTodos = computed(() => store.getters.filteredTodos)
const totalCount = computed(() => store.getters.totalCount)
</script>

<template>
  <div class="app">
    <header class="app-header">
      <h1>📝 Vue + Vuex Todo</h1>
      <p class="subtitle">State Management with Vuex 4 & TypeScript</p>
    </header>

    <main class="app-main">
      <div class="todo-container">
        <TodoInput />
        <TodoFilter v-if="totalCount > 0" />
        <TodoList :todos="filteredTodos" />
        <TodoStats v-if="totalCount > 0" />
      </div>
    </main>

    <footer class="app-footer">
      <p>
        Built with Vue 3, Vuex 4, and TypeScript |
        <a href="https://vuex.vuejs.org/" target="_blank">Learn Vuex</a>
      </p>
    </footer>
  </div>
</template>

<style scoped>
.app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.app-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 2rem;
  text-align: center;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.app-header h1 {
  margin: 0;
  font-size: 2.5rem;
  font-weight: 700;
}

.subtitle {
  margin: 0.5rem 0 0 0;
  opacity: 0.9;
  font-size: 1rem;
}

.app-main {
  flex: 1;
  display: flex;
  justify-content: center;
  padding: 2rem 1rem;
  background: linear-gradient(to bottom, #f8f9fa 0%, #e9ecef 100%);
}

.todo-container {
  width: 100%;
  max-width: 600px;
}

.app-footer {
  background: #2d3748;
  color: white;
  padding: 1rem;
  text-align: center;
}

.app-footer p {
  margin: 0;
  font-size: 0.875rem;
}

.app-footer a {
  color: #667eea;
  text-decoration: none;
  font-weight: 500;
}

.app-footer a:hover {
  text-decoration: underline;
}
</style>
