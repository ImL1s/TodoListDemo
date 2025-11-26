<script lang="ts">
  import { todoStats, todoActions } from '../stores/todoStore';
  import { scale } from 'svelte/transition';
</script>

<div class="todo-stats" transition:scale={{ duration: 200 }}>
  <div class="stat-item">
    <span class="stat-value">{$todoStats.total}</span>
    <span class="stat-label">Total</span>
  </div>

  <div class="stat-item">
    <span class="stat-value text-blue-600">{$todoStats.active}</span>
    <span class="stat-label">Active</span>
  </div>

  <div class="stat-item">
    <span class="stat-value text-green-600">{$todoStats.completed}</span>
    <span class="stat-label">Completed</span>
  </div>

  {#if $todoStats.completed > 0}
    <button
      on:click={todoActions.clearCompleted}
      class="clear-btn"
      transition:scale={{ duration: 200 }}
    >
      Clear Completed
    </button>
  {/if}
</div>

<style>
  .todo-stats {
    @apply flex items-center gap-6 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm;
  }

  .stat-item {
    @apply flex flex-col items-center;
  }

  .stat-value {
    @apply text-2xl font-bold;
  }

  .stat-label {
    @apply text-sm text-gray-500 dark:text-gray-400;
  }

  .clear-btn {
    @apply ml-auto px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors font-medium;
  }
</style>
