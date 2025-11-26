<script setup lang="ts">
import { useTodoStore } from '@/stores/useTodoStore'
import { storeToRefs } from 'pinia'
import type { FilterType } from '@/types'

const todoStore = useTodoStore()
const { filter } = storeToRefs(todoStore)

const filters: { value: FilterType; label: string }[] = [
  { value: 'all', label: '全部' },
  { value: 'active', label: '進行中' },
  { value: 'completed', label: '已完成' }
]

const setFilter = (filterValue: FilterType) => {
  todoStore.setFilter(filterValue)
}
</script>

<template>
  <div class="todo-filter">
    <button
      v-for="filterItem in filters"
      :key="filterItem.value"
      :class="['filter-btn', { active: filter === filterItem.value }]"
      @click="setFilter(filterItem.value)"
    >
      {{ filterItem.label }}
    </button>
  </div>
</template>

<style scoped>
.todo-filter {
  display: flex;
  gap: 0.5rem;
  padding: 1rem;
  background: white;
  border-radius: 0.5rem;
  border: 1px solid #e5e7eb;
}

.filter-btn {
  flex: 1;
  padding: 0.625rem 1rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: #6b7280;
  background: transparent;
  border: none;
  border-radius: 0.375rem;
  cursor: pointer;
  transition: all 0.2s;
}

.filter-btn:hover {
  color: #374151;
  background: #f3f4f6;
}

.filter-btn.active {
  color: white;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
}
</style>
