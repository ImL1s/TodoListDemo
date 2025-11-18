<template>
  <div class="todo-filter">
    <div class="filter-buttons">
      <button
        v-for="option in filterOptions"
        :key="option.value"
        :class="{ active: modelValue === option.value }"
        @click="$emit('update:modelValue', option.value)"
      >
        {{ option.label }}
      </button>
    </div>
    <div class="stats">
      <span class="stat-item">
        <strong>{{ stats.active }}</strong> active
      </span>
      <span class="stat-item">
        <strong>{{ stats.completed }}</strong> completed
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { FilterType, TodoStats } from '../types'

defineProps<{
  modelValue: FilterType
  stats: TodoStats
}>()

defineEmits<{
  'update:modelValue': [value: FilterType]
}>()

const filterOptions = [
  { value: 'all' as FilterType, label: 'All' },
  { value: 'active' as FilterType, label: 'Active' },
  { value: 'completed' as FilterType, label: 'Completed' }
]
</script>

<style scoped>
.todo-filter {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
  padding: 16px 0;
  border-top: 2px solid #e0e0e0;
  margin-top: 20px;
}

.filter-buttons {
  display: flex;
  gap: 8px;
}

.filter-buttons button {
  padding: 8px 16px;
  border: 2px solid #e0e0e0;
  background: white;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.3s;
}

.filter-buttons button:hover {
  border-color: #42b983;
  color: #42b983;
}

.filter-buttons button.active {
  background: #42b983;
  color: white;
  border-color: #42b983;
}

.stats {
  display: flex;
  gap: 16px;
  font-size: 14px;
  color: #666;
}

.stat-item strong {
  color: #42b983;
  font-size: 16px;
}

@media (max-width: 600px) {
  .todo-filter {
    flex-direction: column;
    align-items: stretch;
  }

  .filter-buttons {
    justify-content: center;
  }

  .stats {
    justify-content: center;
  }
}
</style>
