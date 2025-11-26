<template>
  <div>
    <NuxtPage />
  </div>
</template>

<script setup lang="ts">
// Nuxt 3 自动导入，无需手动导入组件
// 使用 useHead 来管理 head 标签（也可以在 nuxt.config.ts 中配置）
useHead({
  titleTemplate: '%s - Nuxt 3 Todo App',
  htmlAttrs: {
    lang: 'zh-TW'
  }
})
</script>
