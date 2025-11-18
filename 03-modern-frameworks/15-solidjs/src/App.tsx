/**
 * Main App Component
 *
 * Root component that demonstrates the complete SolidJS todo application.
 * Shows how all pieces work together with fine-grained reactivity.
 *
 * Key concepts demonstrated:
 * - Component composition
 * - Global state access
 * - Computed values (derived state)
 * - Show component for conditional rendering
 * - classList for dynamic classes
 * - Event handling
 */

import { Show } from 'solid-js';
import TodoInput from './components/TodoInput';
import TodoList from './components/TodoList';
import {
  store,
  setFilter,
  clearCompleted,
  toggleAll,
  getActiveCount,
  hasCompletedTodos,
  allCompleted,
} from './store/todoStore';
import type { Component } from 'solid-js';
import type { FilterType } from './types';
import './App.css';

const App: Component = () => {
  /**
   * Computed values
   *
   * These are reactive getters that automatically update
   * when their dependencies change. SolidJS tracks which
   * components use these values and only updates those components.
   */
  const activeCount = () => getActiveCount();
  const hasCompleted = () => hasCompletedTodos();
  const isAllCompleted = () => allCompleted();
  const hasTodos = () => store.todos.length > 0;

  /**
   * Filter handlers
   * Update the filter in the global store
   */
  const handleFilterChange = (filter: FilterType) => {
    setFilter(filter);
  };

  /**
   * Toggle all todos
   * Mark all as complete or incomplete
   */
  const handleToggleAll = () => {
    toggleAll();
  };

  /**
   * Clear completed todos
   */
  const handleClearCompleted = () => {
    clearCompleted();
  };

  /**
   * Pluralize item text
   */
  const itemText = () => (activeCount() === 1 ? 'item' : 'items');

  return (
    <div class="app">
      <div class="todo-app">
        {/* Header */}
        <header class="app-header">
          <h1>todos</h1>
          <p class="subtitle">SolidJS with Fine-Grained Reactivity</p>
        </header>

        {/* Main content */}
        <div class="main-content">
          {/* Toggle all checkbox - only show when there are todos */}
          <Show when={hasTodos()}>
            <div class="toggle-all-container">
              <input
                type="checkbox"
                id="toggle-all"
                class="toggle-all"
                checked={isAllCompleted()}
                onChange={handleToggleAll}
              />
              <label for="toggle-all">Mark all as complete</label>
            </div>
          </Show>

          {/* Input for new todos */}
          <TodoInput />

          {/* Todo list */}
          <TodoList />
        </div>

        {/* Footer - only show when there are todos */}
        <Show when={hasTodos()}>
          <footer class="app-footer">
            {/* Active count */}
            <span class="todo-count">
              <strong>{activeCount()}</strong> {itemText()} left
            </span>

            {/* Filters */}
            <div class="filters">
              <button
                classList={{
                  'filter-btn': true,
                  active: store.filter === 'all',
                }}
                onClick={() => handleFilterChange('all')}
              >
                All
              </button>
              <button
                classList={{
                  'filter-btn': true,
                  active: store.filter === 'active',
                }}
                onClick={() => handleFilterChange('active')}
              >
                Active
              </button>
              <button
                classList={{
                  'filter-btn': true,
                  active: store.filter === 'completed',
                }}
                onClick={() => handleFilterChange('completed')}
              >
                Completed
              </button>
            </div>

            {/* Clear completed button */}
            <Show when={hasCompleted()}>
              <button class="clear-completed" onClick={handleClearCompleted}>
                Clear completed
              </button>
            </Show>
          </footer>
        </Show>

        {/* Info footer */}
        <footer class="info-footer">
          <p>Double-click to edit a todo</p>
          <p>
            Built with <a href="https://www.solidjs.com/">SolidJS</a>
          </p>
          <p>Demonstrating fine-grained reactivity without virtual DOM</p>
        </footer>
      </div>
    </div>
  );
};

export default App;
