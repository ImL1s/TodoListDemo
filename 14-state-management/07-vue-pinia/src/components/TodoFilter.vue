<script setup lang="ts">
import { useTodoStore } from '../stores/useTodoStore'
import type { FilterType } from '../types'

const todoStore = useTodoStore()

const filters: { value: FilterType; label: string }[] = [
  { value: 'all', label: '全部' },
  { value: 'active', label: '進行中' },
  { value: 'completed', label: '已完成' }
]
</script>

<template>
  <div class="filter-container">
    <div class="filter-buttons">
      <button
        v-for="filter in filters"
        :key="filter.value"
        :class="['filter-btn', { active: todoStore.filter === filter.value }]"
        @click="todoStore.setFilter(filter.value)"
      >
        {{ filter.label }}
      </button>
    </div>

    <div class="filter-actions">
      <button
        v-if="todoStore.totalCount > 0"
        @click="todoStore.toggleAll"
        class="action-btn"
      >
        {{ todoStore.allCompleted ? '取消全選' : '全選' }}
      </button>
      <button
        v-if="todoStore.completedCount > 0"
        @click="todoStore.clearCompleted"
        class="action-btn clear-btn"
      >
        清除已完成 ({{ todoStore.completedCount }})
      </button>
    </div>
  </div>
</template>

<style scoped>
.filter-container {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: white;
  border-radius: 0.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  margin-bottom: 1.5rem;
}

.filter-buttons {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.filter-btn {
  padding: 0.5rem 1rem;
  font-size: 0.9rem;
  border: 2px solid #e2e8f0;
  border-radius: 0.5rem;
  background: white;
  color: #4a5568;
  cursor: pointer;
  transition: all 0.2s;
}

.filter-btn:hover {
  border-color: #42b883;
  color: #42b883;
}

.filter-btn.active {
  background: #42b883;
  border-color: #42b883;
  color: white;
  font-weight: 600;
}

.filter-actions {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.action-btn {
  padding: 0.5rem 1rem;
  font-size: 0.9rem;
  border: 2px solid #e2e8f0;
  border-radius: 0.5rem;
  background: white;
  color: #4a5568;
  cursor: pointer;
  transition: all 0.2s;
}

.action-btn:hover {
  background: #f7fafc;
  border-color: #cbd5e0;
}

.clear-btn:hover {
  background: #fed7d7;
  border-color: #fc8181;
  color: #c53030;
}

@media (max-width: 640px) {
  .filter-container {
    flex-direction: column;
    align-items: stretch;
  }

  .filter-buttons,
  .filter-actions {
    width: 100%;
  }

  .filter-btn,
  .action-btn {
    flex: 1;
  }
}
</style>
