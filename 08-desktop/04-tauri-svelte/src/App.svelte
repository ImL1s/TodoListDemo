<script lang="ts">
  import { onMount } from 'svelte';
  import { todoActions } from './lib/stores/todoStore';
  import { listen } from '@tauri-apps/api/event';
  import { getCurrentWindow } from '@tauri-apps/api/window';
  import TodoInput from './lib/components/TodoInput.svelte';
  import TodoList from './lib/components/TodoList.svelte';
  import TodoFilter from './lib/components/TodoFilter.svelte';
  import TodoStats from './lib/components/TodoStats.svelte';
  import SearchBar from './lib/components/SearchBar.svelte';

  let appWindow = getCurrentWindow();

  onMount(async () => {
    // Load todos on startup
    await todoActions.loadTodos();

    // Listen for Tauri events
    const unlisten = await listen('refresh-todos', async () => {
      await todoActions.loadTodos();
    });

    // Register keyboard shortcuts
    document.addEventListener('keydown', handleKeyboard);

    return () => {
      unlisten();
      document.removeEventListener('keydown', handleKeyboard);
    };
  });

  function handleKeyboard(e: KeyboardEvent) {
    // Cmd/Ctrl + R: Refresh todos
    if ((e.metaKey || e.ctrlKey) && e.key === 'r') {
      e.preventDefault();
      todoActions.loadTodos();
    }

    // Cmd/Ctrl + F: Focus search
    if ((e.metaKey || e.ctrlKey) && e.key === 'f') {
      e.preventDefault();
      const searchInput = document.querySelector('input[placeholder="Search todos..."]') as HTMLInputElement;
      searchInput?.focus();
    }

    // Cmd/Ctrl + N: Focus new todo input
    if ((e.metaKey || e.ctrlKey) && e.key === 'n') {
      e.preventDefault();
      const todoInput = document.querySelector('input[placeholder^="What needs"]') as HTMLInputElement;
      todoInput?.focus();
    }

    // Cmd/Ctrl + W: Close window
    if ((e.metaKey || e.ctrlKey) && e.key === 'w') {
      e.preventDefault();
      appWindow.close();
    }

    // Cmd/Ctrl + M: Minimize window
    if ((e.metaKey || e.ctrlKey) && e.key === 'm') {
      e.preventDefault();
      appWindow.minimize();
    }
  }
</script>

<main class="container">
  <header class="header">
    <h1 class="title">
      <svg class="w-8 h-8 inline-block mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
      </svg>
      Tauri + Svelte Todo
    </h1>
    <p class="subtitle">Built with Tauri 2.0 and Svelte 4</p>
  </header>

  <div class="content">
    <TodoInput />
    <SearchBar />

    <div class="flex gap-4 mb-6">
      <TodoFilter />
      <TodoStats />
    </div>

    <TodoList />
  </div>

  <footer class="footer">
    <div class="keyboard-hints">
      <span class="hint">⌘/Ctrl+N New</span>
      <span class="hint">⌘/Ctrl+F Search</span>
      <span class="hint">⌘/Ctrl+R Refresh</span>
      <span class="hint">⌘/Ctrl+W Close</span>
    </div>
  </footer>
</main>

<style>
  .container {
    @apply min-h-screen p-6 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800;
  }

  .header {
    @apply text-center mb-8;
  }

  .title {
    @apply text-4xl font-bold text-gray-800 dark:text-white mb-2 flex items-center justify-center;
  }

  .subtitle {
    @apply text-gray-600 dark:text-gray-400;
  }

  .content {
    @apply max-w-3xl mx-auto;
  }

  .footer {
    @apply fixed bottom-0 left-0 right-0 p-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-t border-gray-200 dark:border-gray-700;
  }

  .keyboard-hints {
    @apply flex justify-center gap-4 text-xs text-gray-500 dark:text-gray-400;
  }

  .hint {
    @apply px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded;
  }

  :global(body) {
    @apply pb-16;
  }
</style>
