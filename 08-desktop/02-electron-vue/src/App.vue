<template>
  <div id="app">
    <TitleBar v-if="!isMac" />

    <div class="container">
      <header class="app-header">
        <h1>Vue Todo List</h1>
        <p class="subtitle">Powered by Electron + Vue 3</p>
        <div class="shortcuts-hint">
          <kbd>{{ cmdKey }}+N</kbd> New Todo
          <kbd>{{ cmdKey }}+F</kbd> Focus Search
          <kbd>{{ cmdKey }}+Shift+T</kbd> Toggle Window
        </div>
      </header>

      <main class="main-content">
        <TodoInput
          ref="todoInputRef"
          @add="handleAddTodo"
        />

        <div v-if="hasActiveTodos" class="bulk-actions">
          <button @click="handleToggleAll">
            {{ stats.active > 0 ? 'Complete All' : 'Activate All' }}
          </button>
          <button
            v-if="hasCompletedTodos"
            @click="handleClearCompleted"
            class="danger"
          >
            Clear Completed ({{ stats.completed }})
          </button>
        </div>

        <TodoList
          :todos="todos"
          :filter="filter"
          :loading="loading"
          @toggle="handleToggleTodo"
          @delete="handleDeleteTodo"
          @update="handleUpdateTodo"
        />

        <TodoFilter
          v-if="stats.total > 0"
          v-model="filter"
          :stats="stats"
        />
      </main>

      <footer class="app-footer">
        <p>
          Double-click to edit a todo •
          {{ stats.total }} {{ stats.total === 1 ? 'item' : 'items' }} total
        </p>
      </footer>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import TitleBar from './components/TitleBar.vue'
import TodoInput from './components/TodoInput.vue'
import TodoList from './components/TodoList.vue'
import TodoFilter from './components/TodoFilter.vue'
import { useTodos } from './composables/useTodos'
import { useShortcuts } from './composables/useShortcuts'

const {
  todos,
  filter,
  loading,
  stats,
  hasActiveTodos,
  hasCompletedTodos,
  addTodo,
  updateTodo,
  toggleTodo,
  deleteTodo,
  toggleAll,
  clearCompleted,
  setFilter
} = useTodos()

const todoInputRef = ref<InstanceType<typeof TodoInput> | null>(null)

const isMac = window.electronAPI.platform === 'darwin'
const cmdKey = computed(() => isMac ? '⌘' : 'Ctrl')

const handleAddTodo = (text: string) => {
  addTodo(text)
}

const handleToggleTodo = (id: string) => {
  toggleTodo(id)
}

const handleDeleteTodo = (id: string) => {
  deleteTodo(id)
}

const handleUpdateTodo = (id: string, text: string) => {
  updateTodo(id, text)
}

const handleToggleAll = () => {
  toggleAll()
}

const handleClearCompleted = () => {
  if (confirm(`Delete ${stats.value.completed} completed todos?`)) {
    clearCompleted()
  }
}

// Register keyboard shortcuts
useShortcuts({
  onNewTodo: () => {
    todoInputRef.value?.focus()
  },
  onFocusSearch: () => {
    todoInputRef.value?.focus()
  }
})
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
    Ubuntu, Cantarell, 'Helvetica Neue', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  overflow: hidden;
}

#app {
  height: 100vh;
  display: flex;
  flex-direction: column;
}

.container {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.app-header {
  background: white;
  padding: 30px 40px 20px;
  text-align: center;
  border-bottom: 2px solid #e0e0e0;
}

.app-header h1 {
  font-size: 36px;
  color: #2c3e50;
  margin-bottom: 8px;
  font-weight: 700;
}

.subtitle {
  color: #666;
  font-size: 14px;
  margin-bottom: 16px;
}

.shortcuts-hint {
  display: flex;
  justify-content: center;
  gap: 16px;
  flex-wrap: wrap;
  font-size: 12px;
  color: #999;
}

.shortcuts-hint kbd {
  background: #f5f5f5;
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 2px 6px;
  font-family: monospace;
  font-size: 11px;
  color: #666;
}

.main-content {
  flex: 1;
  background: #f5f5f5;
  padding: 30px 40px;
  overflow-y: auto;
}

.bulk-actions {
  display: flex;
  gap: 12px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.bulk-actions button {
  padding: 10px 20px;
  border: 2px solid #42b983;
  background: white;
  color: #42b983;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  transition: all 0.3s;
}

.bulk-actions button:hover {
  background: #42b983;
  color: white;
}

.bulk-actions button.danger {
  border-color: #ff6b6b;
  color: #ff6b6b;
}

.bulk-actions button.danger:hover {
  background: #ff6b6b;
  color: white;
}

.app-footer {
  background: white;
  padding: 16px 40px;
  text-align: center;
  border-top: 2px solid #e0e0e0;
  font-size: 13px;
  color: #999;
}

/* Scrollbar styling */
.main-content::-webkit-scrollbar {
  width: 8px;
}

.main-content::-webkit-scrollbar-track {
  background: #f1f1f1;
}

.main-content::-webkit-scrollbar-thumb {
  background: #ccc;
  border-radius: 4px;
}

.main-content::-webkit-scrollbar-thumb:hover {
  background: #999;
}

@media (max-width: 768px) {
  .main-content {
    padding: 20px;
  }

  .app-header {
    padding: 20px;
  }

  .app-header h1 {
    font-size: 28px;
  }
}
</style>
