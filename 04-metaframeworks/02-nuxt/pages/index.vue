<template>
  <div class="app-container">
    <header class="app-header">
      <h1>📝 Nuxt 3 Todo List</h1>
      <p class="subtitle">使用 Vue 3 元框架构建 - SSR & Auto Imports</p>
    </header>

    <main class="app-main">
      <!-- Todo 输入组件 -->
      <TodoInput />

      <!-- Todo 列表组件 -->
      <TodoList />
    </main>

    <footer class="app-footer">
      <p>
        Built with
        <a href="https://nuxt.com" target="_blank" rel="noopener">Nuxt 3</a>
        &
        <a href="https://vuejs.org" target="_blank" rel="noopener">Vue 3</a>
      </p>
    </footer>
  </div>
</template>

<script setup lang="ts">
// Nuxt 3 自动导入组件，无需手动导入
// 设置页面元数据
useHead({
  title: '首页'
})

// 定义 SEO meta 标签
useSeoMeta({
  title: 'Nuxt 3 Todo List',
  ogTitle: 'Nuxt 3 Todo List',
  description: '使用 Nuxt 3 构建的全栈 Todo List 应用',
  ogDescription: '使用 Nuxt 3 构建的全栈 Todo List 应用',
  ogImage: '/og-image.png',
  twitterCard: 'summary_large_image',
})
</script>

<style scoped>
.app-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 1rem;
}

.app-header {
  text-align: center;
  color: white;
  padding: 2rem 1rem;
  animation: fadeInDown 0.6s ease-out;
}

.app-header h1 {
  font-size: clamp(2rem, 5vw, 3rem);
  margin: 0 0 0.5rem 0;
  font-weight: 700;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
}

.subtitle {
  font-size: clamp(0.9rem, 2vw, 1.1rem);
  opacity: 0.95;
  margin: 0;
  font-weight: 400;
}

.app-main {
  flex: 1;
  max-width: 800px;
  width: 100%;
  margin: 0 auto;
  padding: 0 1rem 2rem;
}

.app-footer {
  text-align: center;
  color: white;
  padding: 1.5rem 1rem;
  font-size: 0.9rem;
  opacity: 0.9;
}

.app-footer p {
  margin: 0;
}

.app-footer a {
  color: #fff;
  text-decoration: underline;
  font-weight: 600;
  transition: opacity 0.2s;
}

.app-footer a:hover {
  opacity: 0.8;
}

@keyframes fadeInDown {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 640px) {
  .app-container {
    padding: 0.5rem;
  }

  .app-header {
    padding: 1.5rem 0.5rem;
  }

  .app-main {
    padding: 0 0.5rem 1.5rem;
  }
}
</style>
