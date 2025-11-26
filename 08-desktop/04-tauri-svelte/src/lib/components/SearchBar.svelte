<script lang="ts">
  import { searchQuery, todoActions } from '../stores/todoStore';

  function handleInput(e: Event) {
    const target = e.target as HTMLInputElement;
    todoActions.setSearch(target.value);
  }

  function clearSearch() {
    todoActions.setSearch('');
  }
</script>

<div class="search-bar">
  <svg class="search-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>

  <input
    type="text"
    value={$searchQuery}
    on:input={handleInput}
    placeholder="Search todos..."
    class="flex-1 px-4 py-2 pl-10 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:border-blue-500 dark:bg-gray-800 dark:text-white"
  />

  {#if $searchQuery}
    <button
      on:click={clearSearch}
      class="clear-search-btn"
      title="Clear search"
    >
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
      </svg>
    </button>
  {/if}
</div>

<style>
  .search-bar {
    @apply relative flex items-center mb-4;
  }

  .search-icon {
    @apply absolute left-3 w-5 h-5 text-gray-400 pointer-events-none;
  }

  .clear-search-btn {
    @apply absolute right-3 p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors;
  }
</style>
