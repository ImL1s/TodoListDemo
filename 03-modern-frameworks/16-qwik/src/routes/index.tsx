import { component$, useStore, useSignal, $, useVisibleTask$ } from '@builder.io/qwik';
import type { DocumentHead } from '@builder.io/qwik-city';
import { TodoInput } from '../components/todo-input/todo-input';
import { TodoList } from '../components/todo-list/todo-list';
import type { TodoStore, FilterType, Todo } from '../types';
import {
  STORAGE_KEY,
  createTodo,
  filterTodos,
  calculateStats,
} from '../types';

/**
 * Main Todo Application Route Component
 *
 * This is a Qwik City route component (file-based routing).
 * The file location (src/routes/index.tsx) makes this the home page.
 *
 * Key Qwik Concepts Demonstrated:
 *
 * 1. useStore - Reactive store for complex state
 *    Unlike React's useState, useStore creates a deeply reactive object.
 *    Any mutation to the store triggers fine-grained updates.
 *
 * 2. useSignal - Reactive signal for simple state
 *    Lightweight alternative to useStore for primitive values.
 *
 * 3. useVisibleTask$ - Effect that runs when component becomes visible
 *    Used here for localStorage access (client-side only).
 *    The $ suffix means it's lazy-loaded and resumable.
 *
 * 4. $ optimizer - All event handlers use $ for automatic code splitting
 *    These handlers are extracted and loaded only when needed.
 *
 * 5. Resumability - The entire app state is serialized and can resume
 *    on the client without re-executing any JavaScript (no hydration).
 */

export default component$(() => {
  /**
   * Main todo store - deeply reactive
   *
   * In Qwik, you can mutate the store directly:
   *   store.todos.push(newTodo)  ✅ This works and is reactive
   *
   * In React, you'd need:
   *   setTodos([...todos, newTodo])  ⚠️ Different pattern
   */
  const store = useStore<TodoStore>({
    todos: [],
    filter: 'all',
    editingId: null,
  });

  /**
   * Loading state signal
   */
  const isLoading = useSignal(true);

  /**
   * Load todos from localStorage
   *
   * useVisibleTask$ is used instead of useTask$ because:
   * 1. localStorage is only available in the browser (not during SSR)
   * 2. We want this to run only when the component is visible
   * 3. The { strategy: 'document-ready' } ensures it runs after hydration
   *
   * Note: In Qwik, there's no "hydration" in the traditional sense,
   * but document-ready ensures the browser environment is ready.
   */
  useVisibleTask$(
    ({ track }) => {
      // This runs on the client only
      track(() => store.todos.length); // Track todos for persistence

      // Load from localStorage on mount
      if (isLoading.value) {
        try {
          const stored = localStorage.getItem(STORAGE_KEY);
          if (stored) {
            const parsed = JSON.parse(stored);
            if (Array.isArray(parsed)) {
              store.todos = parsed;
            }
          }
        } catch (error) {
          console.error('Failed to load todos from localStorage:', error);
        } finally {
          isLoading.value = false;
        }
        return;
      }

      // Save to localStorage on changes
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(store.todos));
      } catch (error) {
        console.error('Failed to save todos to localStorage:', error);
      }
    },
    { strategy: 'document-ready' }
  );

  /**
   * Add a new todo
   *
   * The $ suffix makes this a QRL (Qwik Resource Locator).
   * This function will be:
   * 1. Extracted into a separate chunk
   * 2. Loaded only when called
   * 3. Serializable and resumable
   */
  const handleAddTodo$ = $((text: string) => {
    const newTodo = createTodo(text);
    store.todos = [...store.todos, newTodo];
  });

  /**
   * Toggle a todo's completed status
   */
  const handleToggleTodo$ = $((id: string) => {
    const todo = store.todos.find(t => t.id === id);
    if (todo) {
      todo.completed = !todo.completed;
    }
  });

  /**
   * Delete a todo
   */
  const handleDeleteTodo$ = $((id: string) => {
    store.todos = store.todos.filter(t => t.id !== id);
    if (store.editingId === id) {
      store.editingId = null;
    }
  });

  /**
   * Start editing a todo
   */
  const handleEditStart$ = $((id: string) => {
    store.editingId = id;
  });

  /**
   * Save edited todo
   */
  const handleEditSave$ = $((id: string, text: string) => {
    const todo = store.todos.find(t => t.id === id);
    if (todo) {
      todo.text = text.trim();
    }
    store.editingId = null;
  });

  /**
   * Cancel editing
   */
  const handleEditCancel$ = $(() => {
    store.editingId = null;
  });

  /**
   * Toggle all todos
   */
  const handleToggleAll$ = $(() => {
    const allCompleted = store.todos.every(todo => todo.completed);
    store.todos.forEach(todo => {
      todo.completed = !allCompleted;
    });
  });

  /**
   * Clear completed todos
   */
  const handleClearCompleted$ = $(() => {
    store.todos = store.todos.filter(todo => !todo.completed);
  });

  /**
   * Change filter
   */
  const handleFilterChange$ = $((filter: FilterType) => {
    store.filter = filter;
  });

  // Calculate filtered todos and stats
  const filteredTodos = filterTodos(store.todos, store.filter);
  const stats = calculateStats(store.todos);

  return (
    <div class="app-container">
      <header class="app-header">
        <h1 class="app-title">
          <svg
            class="logo"
            width="32"
            height="32"
            viewBox="0 0 32 32"
            fill="none"
          >
            <circle cx="16" cy="16" r="14" stroke="currentColor" stroke-width="2" />
            <path
              d="M10 16l4 4 8-8"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
          Qwik Todo
        </h1>
        <p class="app-subtitle">
          Resumable • Zero JS by default • Instant-on
        </p>
      </header>

      <main class="app-main">
        <div class="todo-container">
          <TodoInput onAdd$={handleAddTodo$} />

          {isLoading.value ? (
            <div class="loading-state">
              <div class="spinner"></div>
              <p>Loading todos...</p>
            </div>
          ) : (
            <>
              <div class="filter-tabs">
                <button
                  class={{
                    'filter-tab': true,
                    'active': store.filter === 'all',
                  }}
                  onClick$={() => handleFilterChange$('all')}
                  aria-label="Show all todos"
                  aria-pressed={store.filter === 'all'}
                >
                  All
                  <span class="filter-count">{stats.total}</span>
                </button>
                <button
                  class={{
                    'filter-tab': true,
                    'active': store.filter === 'active',
                  }}
                  onClick$={() => handleFilterChange$('active')}
                  aria-label="Show active todos"
                  aria-pressed={store.filter === 'active'}
                >
                  Active
                  <span class="filter-count">{stats.active}</span>
                </button>
                <button
                  class={{
                    'filter-tab': true,
                    'active': store.filter === 'completed',
                  }}
                  onClick$={() => handleFilterChange$('completed')}
                  aria-label="Show completed todos"
                  aria-pressed={store.filter === 'completed'}
                >
                  Completed
                  <span class="filter-count">{stats.completed}</span>
                </button>
              </div>

              <TodoList
                todos={filteredTodos}
                editingId={store.editingId}
                onToggle$={handleToggleTodo$}
                onDelete$={handleDeleteTodo$}
                onEditStart$={handleEditStart$}
                onEditSave$={handleEditSave$}
                onEditCancel$={handleEditCancel$}
                onToggleAll$={handleToggleAll$}
                onClearCompleted$={handleClearCompleted$}
              />

              {stats.total > 0 && (
                <div class="stats-panel">
                  <div class="stat-item">
                    <span class="stat-label">Completion Rate</span>
                    <div class="progress-bar">
                      <div
                        class="progress-fill"
                        style={`width: ${stats.completionRate}%`}
                      ></div>
                    </div>
                    <span class="stat-value">{stats.completionRate}%</span>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </main>

      <footer class="app-footer">
        <p class="footer-text">
          Built with <strong>Qwik</strong> - The resumable framework
        </p>
        <div class="footer-links">
          <a
            href="https://qwik.builder.io"
            target="_blank"
            rel="noopener noreferrer"
            class="footer-link"
          >
            Documentation
          </a>
          <span class="separator">•</span>
          <a
            href="https://github.com/BuilderIO/qwik"
            target="_blank"
            rel="noopener noreferrer"
            class="footer-link"
          >
            GitHub
          </a>
        </div>
      </footer>

      <style>{`
        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }

        :root {
          --primary-color: #18b6f6;
          --primary-dark: #0e8cc9;
          --primary-light: #e6f7ff;
          --success-color: #52c41a;
          --danger-color: #ff4d4f;
          --text-primary: #1a1a1a;
          --text-secondary: #666;
          --text-disabled: #999;
          --border-color: #e0e0e0;
          --background: #ffffff;
          --background-hover: #f5f5f5;
          --shadow-sm: 0 2px 4px rgba(0, 0, 0, 0.05);
          --shadow-md: 0 4px 12px rgba(0, 0, 0, 0.1);
          --shadow-lg: 0 8px 24px rgba(0, 0, 0, 0.15);
          --radius: 8px;
          --transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
          line-height: 1.6;
          color: var(--text-primary);
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          min-height: 100vh;
          padding: 20px;
        }

        .app-container {
          max-width: 800px;
          margin: 0 auto;
        }

        .app-header {
          text-align: center;
          margin-bottom: 40px;
          color: white;
        }

        .app-title {
          font-size: 3rem;
          font-weight: 700;
          margin-bottom: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 15px;
        }

        .logo {
          color: white;
        }

        .app-subtitle {
          font-size: 1rem;
          opacity: 0.9;
          font-weight: 300;
        }

        .app-main {
          background: var(--background);
          border-radius: var(--radius);
          box-shadow: var(--shadow-lg);
          overflow: hidden;
        }

        .todo-container {
          padding: 30px;
        }

        .todo-input-form {
          margin-bottom: 30px;
        }

        .input-wrapper {
          display: flex;
          gap: 10px;
        }

        .todo-input {
          flex: 1;
          padding: 14px 18px;
          font-size: 16px;
          border: 2px solid var(--border-color);
          border-radius: var(--radius);
          transition: var(--transition);
          font-family: inherit;
        }

        .todo-input:focus {
          outline: none;
          border-color: var(--primary-color);
          box-shadow: 0 0 0 3px var(--primary-light);
        }

        .add-button {
          padding: 14px 24px;
          background: var(--primary-color);
          color: white;
          border: none;
          border-radius: var(--radius);
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: var(--transition);
          display: flex;
          align-items: center;
          gap: 8px;
          font-family: inherit;
        }

        .add-button:hover:not(:disabled) {
          background: var(--primary-dark);
          transform: translateY(-1px);
          box-shadow: var(--shadow-md);
        }

        .add-button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .filter-tabs {
          display: flex;
          gap: 10px;
          margin-bottom: 20px;
          padding: 5px;
          background: var(--background-hover);
          border-radius: var(--radius);
        }

        .filter-tab {
          flex: 1;
          padding: 10px 16px;
          background: transparent;
          border: none;
          border-radius: 6px;
          font-size: 14px;
          font-weight: 500;
          color: var(--text-secondary);
          cursor: pointer;
          transition: var(--transition);
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          font-family: inherit;
        }

        .filter-tab:hover {
          background: var(--background);
        }

        .filter-tab.active {
          background: white;
          color: var(--primary-color);
          box-shadow: var(--shadow-sm);
        }

        .filter-count {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-width: 24px;
          height: 24px;
          padding: 0 8px;
          background: var(--primary-light);
          color: var(--primary-color);
          border-radius: 12px;
          font-size: 12px;
          font-weight: 600;
        }

        .filter-tab.active .filter-count {
          background: var(--primary-color);
          color: white;
        }

        .todo-list-container {
          margin-bottom: 20px;
        }

        .list-header {
          display: flex;
          align-items: center;
          gap: 15px;
          padding: 15px;
          border-bottom: 1px solid var(--border-color);
        }

        .toggle-all-wrapper {
          position: relative;
        }

        .toggle-all {
          position: absolute;
          opacity: 0;
          width: 0;
          height: 0;
        }

        .toggle-all-label {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 32px;
          height: 32px;
          border: 2px solid var(--border-color);
          border-radius: 6px;
          cursor: pointer;
          transition: var(--transition);
        }

        .toggle-all-icon {
          color: transparent;
          transition: var(--transition);
        }

        .toggle-all:checked + .toggle-all-label {
          background: var(--primary-color);
          border-color: var(--primary-color);
        }

        .toggle-all:checked + .toggle-all-label .toggle-all-icon {
          color: white;
        }

        .toggle-all-label:hover {
          border-color: var(--primary-color);
        }

        .list-count {
          font-size: 14px;
          color: var(--text-secondary);
        }

        .todo-list {
          list-style: none;
        }

        .todo-item {
          border-bottom: 1px solid var(--border-color);
          transition: var(--transition);
        }

        .todo-item:hover {
          background: var(--background-hover);
        }

        .todo-item.completed .todo-text {
          text-decoration: line-through;
          color: var(--text-disabled);
        }

        .view {
          display: flex;
          align-items: center;
          gap: 15px;
          padding: 15px;
        }

        .checkbox-wrapper {
          position: relative;
        }

        .toggle {
          position: absolute;
          opacity: 0;
          width: 0;
          height: 0;
        }

        .checkbox-label {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 24px;
          height: 24px;
          border: 2px solid var(--border-color);
          border-radius: 50%;
          cursor: pointer;
          transition: var(--transition);
        }

        .checkbox-icon {
          color: transparent;
          transition: var(--transition);
        }

        .toggle:checked + .checkbox-label {
          background: var(--success-color);
          border-color: var(--success-color);
        }

        .toggle:checked + .checkbox-label .checkbox-icon {
          color: white;
        }

        .checkbox-label:hover {
          border-color: var(--success-color);
        }

        .todo-text {
          flex: 1;
          font-size: 16px;
          cursor: pointer;
          user-select: none;
        }

        .delete-button {
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: transparent;
          border: none;
          border-radius: 6px;
          color: var(--danger-color);
          cursor: pointer;
          opacity: 0;
          transition: var(--transition);
        }

        .todo-item:hover .delete-button {
          opacity: 1;
        }

        .delete-button:hover {
          background: rgba(255, 77, 79, 0.1);
        }

        .edit-form {
          padding: 10px 15px;
        }

        .edit-input {
          width: 100%;
          padding: 12px;
          font-size: 16px;
          border: 2px solid var(--primary-color);
          border-radius: var(--radius);
          font-family: inherit;
        }

        .edit-input:focus {
          outline: none;
          box-shadow: 0 0 0 3px var(--primary-light);
        }

        .list-footer {
          padding: 15px;
          text-align: right;
        }

        .clear-completed {
          padding: 8px 16px;
          background: transparent;
          border: 1px solid var(--danger-color);
          border-radius: var(--radius);
          color: var(--danger-color);
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: var(--transition);
          font-family: inherit;
        }

        .clear-completed:hover {
          background: var(--danger-color);
          color: white;
        }

        .empty-state {
          text-align: center;
          padding: 60px 20px;
        }

        .empty-text {
          font-size: 20px;
          font-weight: 600;
          color: var(--text-secondary);
          margin-top: 20px;
        }

        .empty-subtext {
          font-size: 14px;
          color: var(--text-disabled);
          margin-top: 8px;
        }

        .loading-state {
          text-align: center;
          padding: 60px 20px;
        }

        .spinner {
          width: 40px;
          height: 40px;
          margin: 0 auto 20px;
          border: 3px solid var(--border-color);
          border-top-color: var(--primary-color);
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .stats-panel {
          margin-top: 30px;
          padding: 20px;
          background: var(--background-hover);
          border-radius: var(--radius);
        }

        .stat-item {
          display: flex;
          align-items: center;
          gap: 15px;
        }

        .stat-label {
          font-size: 14px;
          font-weight: 500;
          color: var(--text-secondary);
          min-width: 120px;
        }

        .progress-bar {
          flex: 1;
          height: 8px;
          background: var(--border-color);
          border-radius: 4px;
          overflow: hidden;
        }

        .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, var(--primary-color), var(--success-color));
          border-radius: 4px;
          transition: width 0.5s ease;
        }

        .stat-value {
          font-size: 16px;
          font-weight: 600;
          color: var(--primary-color);
          min-width: 50px;
          text-align: right;
        }

        .app-footer {
          text-align: center;
          margin-top: 40px;
          color: white;
        }

        .footer-text {
          font-size: 14px;
          margin-bottom: 10px;
          opacity: 0.9;
        }

        .footer-links {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          font-size: 13px;
        }

        .footer-link {
          color: white;
          text-decoration: none;
          opacity: 0.8;
          transition: opacity 0.2s;
        }

        .footer-link:hover {
          opacity: 1;
          text-decoration: underline;
        }

        .separator {
          opacity: 0.5;
        }

        @media (max-width: 640px) {
          .app-title {
            font-size: 2rem;
          }

          .todo-container {
            padding: 20px;
          }

          .input-wrapper {
            flex-direction: column;
          }

          .filter-tabs {
            flex-direction: column;
          }

          .stat-item {
            flex-direction: column;
            align-items: stretch;
          }

          .stat-label {
            min-width: auto;
          }

          .stat-value {
            text-align: left;
          }
        }
      `}</style>
    </div>
  );
});

/**
 * Document head configuration
 *
 * Qwik City uses this to set metadata for the page.
 * This is used for SEO and social sharing.
 */
export const head: DocumentHead = {
  title: 'Qwik Todo - Resumable Todo List',
  meta: [
    {
      name: 'description',
      content: 'A comprehensive Todo List application built with Qwik demonstrating resumability, zero JavaScript by default, and instant-on performance.',
    },
    {
      name: 'viewport',
      content: 'width=device-width, initial-scale=1',
    },
  ],
};
