<script setup lang="ts">
import { useTodoStore } from '@/stores/useTodoStore'
import { storeToRefs } from 'pinia'

const todoStore = useTodoStore()
const { stats, allCompleted, totalCount, completedCount } = storeToRefs(todoStore)

const handleToggleAll = () => {
  todoStore.toggleAll()
}

const handleClearCompleted = () => {
  if (confirm('確定要清除所有已完成的待辦事項嗎？')) {
    todoStore.clearCompleted()
  }
}
</script>

<template>
  <div class="todo-stats">
    <!-- 統計資訊 -->
    <div class="stats-grid">
      <div class="stat-item">
        <div class="stat-value">{{ stats.total }}</div>
        <div class="stat-label">總計</div>
      </div>
      <div class="stat-item">
        <div class="stat-value active">{{ stats.active }}</div>
        <div class="stat-label">進行中</div>
      </div>
      <div class="stat-item">
        <div class="stat-value completed">{{ stats.completed }}</div>
        <div class="stat-label">已完成</div>
      </div>
    </div>

    <!-- 完成率進度條 -->
    <div v-if="totalCount > 0" class="progress-section">
      <div class="progress-header">
        <span class="progress-label">完成率</span>
        <span class="progress-value">{{ stats.completionRate }}%</span>
      </div>
      <div class="progress-bar">
        <div class="progress-fill" :style="{ width: `${stats.completionRate}%` }"></div>
      </div>
    </div>

    <!-- 操作按鈕 -->
    <div v-if="totalCount > 0" class="action-buttons">
      <button @click="handleToggleAll" class="action-btn">
        {{ allCompleted ? '取消全選' : '全選' }}
      </button>
      <button
        v-if="completedCount > 0"
        @click="handleClearCompleted"
        class="action-btn clear-btn"
      >
        清除已完成 ({{ completedCount }})
      </button>
    </div>
  </div>
</template>

<style scoped>
.todo-stats {
  padding: 1.5rem;
  background: white;
  border-radius: 0.5rem;
  border: 1px solid #e5e7eb;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.stat-item {
  text-align: center;
  padding: 1rem;
  background: #f9fafb;
  border-radius: 0.5rem;
}

.stat-value {
  font-size: 1.875rem;
  font-weight: 700;
  color: #374151;
  margin-bottom: 0.25rem;
}

.stat-value.active {
  color: #3b82f6;
}

.stat-value.completed {
  color: #10b981;
}

.stat-label {
  font-size: 0.875rem;
  color: #6b7280;
}

.progress-section {
  margin-bottom: 1.5rem;
}

.progress-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.progress-label {
  font-size: 0.875rem;
  font-weight: 500;
  color: #6b7280;
}

.progress-value {
  font-size: 0.875rem;
  font-weight: 600;
  color: #667eea;
}

.progress-bar {
  height: 8px;
  background: #e5e7eb;
  border-radius: 999px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
  border-radius: 999px;
  transition: width 0.3s ease;
}

.action-buttons {
  display: flex;
  gap: 0.75rem;
}

.action-btn {
  flex: 1;
  padding: 0.75rem 1rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: #4b5563;
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 0.375rem;
  cursor: pointer;
  transition: all 0.2s;
}

.action-btn:hover {
  background: #f3f4f6;
  border-color: #d1d5db;
}

.action-btn.clear-btn {
  color: #ef4444;
}

.action-btn.clear-btn:hover {
  background: #fef2f2;
  border-color: #fecaca;
}
</style>
