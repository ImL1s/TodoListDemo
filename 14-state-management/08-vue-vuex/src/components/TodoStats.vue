<script setup lang="ts">
import { computed } from 'vue'
import { useStore } from '../store'

const store = useStore()

// Using getters from the store
const totalCount = computed(() => store.getters.totalCount)
const activeCount = computed(() => store.getters.activeCount)
const completedCount = computed(() => store.getters.completedCount)
const hasCompleted = computed(() => store.getters.hasCompleted)

const clearCompleted = () => {
  if (confirm('Are you sure you want to clear all completed todos?')) {
    // Dispatch action to clear completed todos
    store.dispatch('clearCompleted')
  }
}
</script>

<template>
  <div class="stats-container">
    <div class="stats">
      <div class="stat-item">
        <span class="stat-label">Total:</span>
        <span class="stat-value">{{ totalCount }}</span>
      </div>
      <div class="stat-item">
        <span class="stat-label">Active:</span>
        <span class="stat-value active">{{ activeCount }}</span>
      </div>
      <div class="stat-item">
        <span class="stat-label">Completed:</span>
        <span class="stat-value completed">{{ completedCount }}</span>
      </div>
    </div>

    <button
      v-if="hasCompleted"
      class="clear-button"
      @click="clearCompleted"
    >
      Clear Completed
    </button>
  </div>
</template>

<style scoped>
.stats-container {
  margin-top: 1.5rem;
  padding: 1rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.stats {
  display: flex;
  justify-content: space-around;
  margin-bottom: 1rem;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
}

.stat-label {
  font-size: 0.75rem;
  color: #718096;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.stat-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: #2d3748;
}

.stat-value.active {
  color: #667eea;
}

.stat-value.completed {
  color: #48bb78;
}

.clear-button {
  width: 100%;
  padding: 0.75rem;
  font-size: 0.875rem;
  font-weight: 600;
  color: white;
  background: linear-gradient(135deg, #f56565 0%, #c53030 100%);
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
}

.clear-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(245, 101, 101, 0.4);
}

.clear-button:active {
  transform: translateY(0);
}
</style>
