<script lang="ts">
  import { fade, fly } from 'svelte/transition';
  import { todoActions } from '../stores/todoStore';
  import type { Todo } from '../types/Todo';

  export let todo: Todo;

  let isEditing = false;
  let editText = todo.text;

  function handleToggle() {
    todoActions.toggleTodo(todo.id);
  }

  function handleDelete() {
    todoActions.deleteTodo(todo.id);
  }

  function startEdit() {
    isEditing = true;
    editText = todo.text;
  }

  function saveEdit() {
    if (editText.trim()) {
      todoActions.updateTodo(todo.id, editText.trim());
    }
    isEditing = false;
  }

  function cancelEdit() {
    isEditing = false;
    editText = todo.text;
  }

  function handleKeydown(e: KeyboardEvent) {
    if (e.key === 'Enter') {
      saveEdit();
    } else if (e.key === 'Escape') {
      cancelEdit();
    }
  }
</script>

<div
  class="todo-item"
  in:fly={{ y: 20, duration: 300 }}
  out:fade={{ duration: 200 }}
>
  <div class="flex items-center gap-3 flex-1">
    <input
      type="checkbox"
      checked={todo.completed}
      on:change={handleToggle}
      class="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
    />

    {#if isEditing}
      <input
        type="text"
        bind:value={editText}
        on:keydown={handleKeydown}
        on:blur={saveEdit}
        class="flex-1 px-2 py-1 border border-blue-500 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        autofocus
      />
    {:else}
      <span
        class="flex-1 cursor-pointer select-none"
        class:line-through={todo.completed}
        class:text-gray-500={todo.completed}
        on:dblclick={startEdit}
      >
        {todo.text}
      </span>
    {/if}
  </div>

  <div class="flex gap-2">
    {#if !isEditing}
      <button
        on:click={startEdit}
        class="px-3 py-1 text-sm text-blue-600 hover:bg-blue-50 rounded transition-colors"
        title="Edit (double-click)"
      >
        Edit
      </button>
      <button
        on:click={handleDelete}
        class="px-3 py-1 text-sm text-red-600 hover:bg-red-50 rounded transition-colors"
        title="Delete"
      >
        Delete
      </button>
    {/if}
  </div>
</div>

<style>
  .todo-item {
    @apply flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-shadow;
  }
</style>
