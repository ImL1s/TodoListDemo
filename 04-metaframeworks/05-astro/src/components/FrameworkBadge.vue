<template>
  <div class="framework-badges">
    <span class="badge react">⚛️ React</span>
    <span class="badge vue">💚 Vue</span>
    <span class="badge astro">🚀 Astro</span>
  </div>
</template>

<script setup lang="ts">
// Vue component to demonstrate multi-framework support
// This component is hydrated with client:visible directive
// Only loads when it becomes visible in the viewport
</script>

<style scoped>
.framework-badges {
  display: flex;
  gap: 0.5rem;
  justify-content: center;
  margin-top: 1rem;
  flex-wrap: wrap;
}

.badge {
  padding: 0.4rem 0.8rem;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 600;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  transition: all 0.3s ease;
}

.badge:hover {
  transform: translateY(-2px);
  background: rgba(255, 255, 255, 0.3);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.badge.react {
  color: #61dafb;
}

.badge.vue {
  color: #42b883;
}

.badge.astro {
  color: #ff5d01;
}
</style>
