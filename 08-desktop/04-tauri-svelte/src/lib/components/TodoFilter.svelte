<script lang="ts">
  import { currentFilter, todoActions } from '../stores/todoStore';
  import type { FilterType } from '../types/Todo';

  const filters: { value: FilterType; label: string }[] = [
    { value: 'all', label: 'All' },
    { value: 'active', label: 'Active' },
    { value: 'completed', label: 'Completed' },
  ];

  function setFilter(filter: FilterType) {
    todoActions.setFilter(filter);
  }
</script>

<div class="todo-filter">
  {#each filters as filter}
    <button
      on:click={() => setFilter(filter.value)}
      class="filter-btn"
      class:active={$currentFilter === filter.value}
    >
      {filter.label}
    </button>
  {/each}
</div>

<style>
  .todo-filter {
    @apply flex gap-2 bg-white dark:bg-gray-800 p-2 rounded-lg shadow-sm;
  }

  .filter-btn {
    @apply px-4 py-2 rounded-md text-sm font-medium transition-all;
    @apply text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700;
  }

  .filter-btn.active {
    @apply bg-blue-600 text-white hover:bg-blue-700;
  }
</style>
