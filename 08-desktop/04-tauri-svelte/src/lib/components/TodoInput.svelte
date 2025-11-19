<script lang="ts">
  import { todoActions } from '../stores/todoStore';

  let inputValue = '';
  let isAdding = false;

  async function handleSubmit() {
    if (!inputValue.trim() || isAdding) return;

    isAdding = true;
    try {
      await todoActions.addTodo(inputValue.trim());
      inputValue = '';
    } finally {
      isAdding = false;
    }
  }

  function handleKeydown(e: KeyboardEvent) {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  }
</script>

<div class="todo-input">
  <input
    type="text"
    bind:value={inputValue}
    on:keydown={handleKeydown}
    placeholder="What needs to be done? (Press Enter)"
    class="flex-1 px-4 py-3 text-lg border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:border-blue-500 dark:bg-gray-800 dark:text-white transition-colors"
    disabled={isAdding}
  />
  <button
    on:click={handleSubmit}
    disabled={!inputValue.trim() || isAdding}
    class="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-medium"
  >
    {isAdding ? 'Adding...' : 'Add'}
  </button>
</div>

<style>
  .todo-input {
    @apply flex gap-3 mb-6;
  }
</style>
