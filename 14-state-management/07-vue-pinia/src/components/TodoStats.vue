<script setup lang="ts">
import { useTodoStore } from '../stores/useTodoStore'

const todoStore = useTodoStore()
</script>

<template>
  <div class="stats-container">
    <h3 class="stats-title">統計資訊</h3>

    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-value">{{ todoStore.stats.total }}</div>
        <div class="stat-label">總計</div>
      </div>

      <div class="stat-card active">
        <div class="stat-value">{{ todoStore.stats.active }}</div>
        <div class="stat-label">進行中</div>
      </div>

      <div class="stat-card completed">
        <div class="stat-value">{{ todoStore.stats.completed }}</div>
        <div class="stat-label">已完成</div>
      </div>

      <div class="stat-card rate">
        <div class="stat-value">{{ todoStore.stats.completionRate }}%</div>
        <div class="stat-label">完成率</div>
      </div>
    </div>

    <div v-if="todoStore.stats.total > 0" class="progress-bar-container">
      <div class="progress-bar">
        <div
          class="progress-fill"
          :style="{ width: todoStore.stats.completionRate + '%' }"
        ></div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.stats-container {
  background: white;
  border-radius: 0.5rem;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  margin-bottom: 1.5rem;
}

.stats-title {
  margin: 0 0 1rem 0;
  font-size: 1.1rem;
  color: #2d3748;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 1rem;
  margin-bottom: 1rem;
}

.stat-card {
  text-align: center;
  padding: 1rem;
  background: #f7fafc;
  border-radius: 0.5rem;
  border: 2px solid #e2e8f0;
  transition: all 0.2s;
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.stat-card.active {
  background: #ebf8ff;
  border-color: #4299e1;
}

.stat-card.completed {
  background: #f0fff4;
  border-color: #48bb78;
}

.stat-card.rate {
  background: #fef5e7;
  border-color: #ecc94b;
}

.stat-value {
  font-size: 2rem;
  font-weight: bold;
  color: #2d3748;
  margin-bottom: 0.25rem;
}

.stat-label {
  font-size: 0.9rem;
  color: #718096;
}

.progress-bar-container {
  margin-top: 1rem;
}

.progress-bar {
  height: 0.5rem;
  background: #e2e8f0;
  border-radius: 1rem;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #42b883 0%, #35495e 100%);
  border-radius: 1rem;
  transition: width 0.3s ease;
}

@media (max-width: 640px) {
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
