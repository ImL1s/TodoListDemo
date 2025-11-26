import { TodoInput } from './components/TodoInput';
import { TodoList } from './components/TodoList';
import type { FilterType } from './types';
import {
  filterSignal,
  activeTodoCountSignal,
  completedTodoCountSignal,
  totalTodoCountSignal,
  setFilter,
} from './signals/todoSignals';

/**
 * App Component
 *
 * Main application component that orchestrates the todo app.
 * Demonstrates:
 * - Component composition
 * - Signal-based state management
 * - Reactive UI updates without explicit state management
 * - Filter controls
 * - Statistics display
 *
 * Key Preact/Signals Feature:
 * Notice how we access signal values directly with .value
 * and the component automatically re-renders when signals change.
 * No need for useState, useEffect, or context!
 */
export function App() {
  // Access signals directly - component auto-updates when they change
  const currentFilter = filterSignal.value;
  const activeCount = activeTodoCountSignal.value;
  const completedCount = completedTodoCountSignal.value;
  const totalCount = totalTodoCountSignal.value;

  /**
   * Handle filter button clicks
   */
  const handleFilterChange = (filter: FilterType) => {
    setFilter(filter);
  };

  /**
   * Render a filter button
   */
  const renderFilterButton = (filter: FilterType, label: string) => (
    <button
      className={`btn filter-btn ${currentFilter === filter ? 'active' : ''}`}
      onClick={() => handleFilterChange(filter)}
      aria-pressed={currentFilter === filter}
    >
      {label}
    </button>
  );

  return (
    <>
      <div className="container">
        <h1>Preact Todo</h1>
        <p className="subtitle">
          Fast 3KB alternative to React with @preact/signals
        </p>

        <TodoInput />

        <div className="filters">
          {renderFilterButton('all', 'All')}
          {renderFilterButton('active', 'Active')}
          {renderFilterButton('completed', 'Completed')}
        </div>

        <TodoList />

        {totalCount > 0 && (
          <div className="stats">
            <span>
              {activeCount} {activeCount === 1 ? 'item' : 'items'} left
            </span>
            <span>
              {completedCount} completed
            </span>
            <span>
              {totalCount} total
            </span>
          </div>
        )}
      </div>

      <div className="footer">
        <p>
          Built with <a href="https://preactjs.com" target="_blank" rel="noopener noreferrer">Preact</a> and{' '}
          <a href="https://preactjs.com/guide/v10/signals" target="_blank" rel="noopener noreferrer">@preact/signals</a>
        </p>
      </div>
    </>
  );
}
