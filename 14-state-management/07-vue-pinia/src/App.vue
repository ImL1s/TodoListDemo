<script setup lang="ts">
import { onMounted, watch } from 'vue'
import { useTodoStore } from './stores/useTodoStore'
import TodoInput from './components/TodoInput.vue'
import TodoList from './components/TodoList.vue'
import TodoFilter from './components/TodoFilter.vue'
import TodoStats from './components/TodoStats.vue'

const todoStore = useTodoStore()

// 初始化時從 localStorage 載入數據
onMounted(() => {
  todoStore.loadFromStorage()
})

// 監聽 todos 變化，自動保存到 localStorage
watch(
  () => todoStore.todos,
  () => {
    todoStore.saveToStorage()
  },
  { deep: true }
)
</script>

<template>
  <div class="app">
    <div class="container">
      <header class="header">
        <h1 class="title">
          <span class="icon">📝</span>
          Vue 3 + Pinia Todo List
        </h1>
        <p class="subtitle">使用 Pinia 進行狀態管理</p>
      </header>

      <main class="main-content">
        <TodoInput />
        <TodoStats />
        <TodoFilter />
        <TodoList />
      </main>

      <footer class="footer">
        <div class="tech-stack">
          <span class="tech-badge">Vue 3</span>
          <span class="tech-badge">Pinia</span>
          <span class="tech-badge">TypeScript</span>
          <span class="tech-badge">Composition API</span>
        </div>
        <p class="info">
          雙擊事項可編輯 • 數據自動保存至 LocalStorage
        </p>
      </footer>
    </div>
  </div>
</template>

<style scoped>
.app {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 2rem 1rem;
}

.container {
  max-width: 800px;
  margin: 0 auto;
}

.header {
  text-align: center;
  margin-bottom: 2rem;
}

.title {
  font-size: 2.5rem;
  font-weight: bold;
  color: white;
  margin: 0 0 0.5rem 0;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
}

.icon {
  display: inline-block;
  animation: bounce 2s infinite;
}

@keyframes bounce {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

.subtitle {
  color: rgba(255, 255, 255, 0.9);
  font-size: 1.1rem;
  margin: 0;
}

.main-content {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 1rem;
  padding: 2rem;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.footer {
  margin-top: 2rem;
  text-align: center;
}

.tech-stack {
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  flex-wrap: wrap;
  margin-bottom: 1rem;
}

.tech-badge {
  padding: 0.5rem 1rem;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 2rem;
  color: white;
  font-size: 0.9rem;
  font-weight: 600;
}

.info {
  color: rgba(255, 255, 255, 0.9);
  font-size: 0.9rem;
  margin: 0;
}

@media (max-width: 640px) {
  .app {
    padding: 1rem 0.5rem;
  }

  .title {
    font-size: 2rem;
  }

  .main-content {
    padding: 1.5rem;
  }
}
</style>
