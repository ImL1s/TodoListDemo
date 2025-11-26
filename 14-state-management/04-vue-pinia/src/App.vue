<script setup lang="ts">
import TodoInput from './components/TodoInput.vue'
import TodoList from './components/TodoList.vue'
import TodoFilter from './components/TodoFilter.vue'
import TodoStats from './components/TodoStats.vue'
</script>

<template>
  <div class="app-container">
    <div class="app-content">
      <!-- Header -->
      <header class="app-header">
        <h1 class="app-title">
          <span class="title-icon">✓</span>
          Vue 3 + Pinia Todo List
        </h1>
        <p class="app-subtitle">使用 Pinia 進行狀態管理的現代化待辦事項應用</p>
      </header>

      <!-- Main Content -->
      <main class="main-content">
        <!-- 輸入框 -->
        <TodoInput />

        <!-- 篩選器 -->
        <TodoFilter />

        <!-- 待辦事項列表 -->
        <TodoList />

        <!-- 統計資訊 -->
        <TodoStats />
      </main>

      <!-- Footer -->
      <footer class="app-footer">
        <p>
          Made with
          <span class="heart">♥</span>
          using Vue 3 + Pinia
        </p>
        <p class="footer-tip">雙擊待辦事項可編輯</p>
      </footer>
    </div>
  </div>
</template>

<style>
/* Global Styles */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu',
    'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  min-height: 100vh;
}
</style>

<style scoped>
.app-container {
  min-height: 100vh;
  padding: 2rem 1rem;
  display: flex;
  justify-content: center;
  align-items: flex-start;
}

.app-content {
  width: 100%;
  max-width: 800px;
}

.app-header {
  text-align: center;
  margin-bottom: 2.5rem;
  color: white;
}

.app-title {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
}

.title-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 3rem;
  height: 3rem;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 0.75rem;
  font-size: 1.75rem;
  backdrop-filter: blur(10px);
}

.app-subtitle {
  font-size: 1rem;
  opacity: 0.95;
  font-weight: 300;
}

.main-content {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 1rem;
  padding: 2rem;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(10px);
}

.app-footer {
  text-align: center;
  margin-top: 2rem;
  color: white;
  font-size: 0.875rem;
  opacity: 0.9;
}

.app-footer p {
  margin: 0.25rem 0;
}

.heart {
  color: #ff6b6b;
  display: inline-block;
  animation: heartbeat 1.5s ease-in-out infinite;
}

.footer-tip {
  font-size: 0.8rem;
  opacity: 0.8;
}

@keyframes heartbeat {
  0%,
  100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
}

/* Responsive Design */
@media (max-width: 640px) {
  .app-container {
    padding: 1rem;
  }

  .app-title {
    font-size: 2rem;
  }

  .main-content {
    padding: 1.5rem;
  }
}
</style>
