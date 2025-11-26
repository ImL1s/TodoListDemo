<script setup lang="ts">
import { computed } from 'vue'
import { useStore } from '../store'
import { FilterType } from '../types'

const store = useStore()

// Get current filter from store state
const currentFilter = computed(() => store.state.filter)

const filters: { label: string; value: FilterType }[] = [
  { label: 'All', value: 'all' },
  { label: 'Active', value: 'active' },
  { label: 'Completed', value: 'completed' }
]

const setFilter = (filter: FilterType) => {
  // Dispatch action to set filter
  store.dispatch('setFilter', filter)
}
</script>

<template>
  <div class="filter-container">
    <button
      v-for="filter in filters"
      :key="filter.value"
      :class="['filter-button', { active: currentFilter === filter.value }]"
      @click="setFilter(filter.value)"
    >
      {{ filter.label }}
    </button>
  </div>
</template>

<style scoped>
.filter-container {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
  padding: 0.5rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.filter-button {
  flex: 1;
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: #4a5568;
  background: transparent;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
}

.filter-button:hover {
  background: #f7fafc;
  border-color: #cbd5e0;
}

.filter-button.active {
  color: white;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-color: transparent;
  box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
}
</style>
