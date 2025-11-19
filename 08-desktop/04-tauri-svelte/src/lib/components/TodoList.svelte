<script lang="ts">
  import { flip } from 'svelte/animate';
  import { filteredTodos } from '../stores/todoStore';
  import TodoItem from './TodoItem.svelte';
</script>

<div class="todo-list">
  {#if $filteredTodos.length === 0}
    <div class="empty-state">
      <svg class="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
      </svg>
      <p class="text-gray-500 dark:text-gray-400">No todos found</p>
    </div>
  {:else}
    <div class="space-y-2">
      {#each $filteredTodos as todo (todo.id)}
        <div animate:flip={{ duration: 300 }}>
          <TodoItem {todo} />
        </div>
      {/each}
    </div>
  {/if}
</div>

<style>
  .todo-list {
    @apply w-full;
  }

  .empty-state {
    @apply text-center py-12;
  }
</style>
