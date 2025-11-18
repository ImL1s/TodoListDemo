/**
 * TodoFilters Component
 *
 * Demonstrates:
 * - useSnapshot for reading state
 * - Using derived computed values (todoStats)
 * - Direct mutations for filter changes
 */

import React from 'react';
import { useSnapshot } from 'valtio';
import { todoState, todoStats, todoActions } from '../store/todoStore';
import type { FilterType } from '../types';

export const TodoFilters: React.FC = () => {
  // useSnapshot for reactive state access
  const snapshot = useSnapshot(todoState);
  const stats = useSnapshot(todoStats);

  const handleFilterChange = (filter: FilterType) => {
    // Direct mutation - just call the action
    todoActions.setFilter(filter);
  };

  const handleClearCompleted = () => {
    // Direct mutation - just call the action
    todoActions.clearCompleted();
  };

  if (stats.total === 0) {
    return null;
  }

  return (
    <div className="todo-filters">
      <div className="todo-count">
        <strong>{stats.active}</strong>
        <span> {stats.active === 1 ? 'item' : 'items'} left</span>
      </div>

      <div className="filter-buttons">
        <button
          className={`filter-button ${snapshot.filter === 'all' ? 'active' : ''}`}
          onClick={() => handleFilterChange('all')}
        >
          All
          <span className="filter-count">{stats.total}</span>
        </button>

        <button
          className={`filter-button ${snapshot.filter === 'active' ? 'active' : ''}`}
          onClick={() => handleFilterChange('active')}
        >
          Active
          <span className="filter-count">{stats.active}</span>
        </button>

        <button
          className={`filter-button ${snapshot.filter === 'completed' ? 'active' : ''}`}
          onClick={() => handleFilterChange('completed')}
        >
          Completed
          <span className="filter-count">{stats.completed}</span>
        </button>
      </div>

      {stats.completed > 0 && (
        <button
          className="clear-completed"
          onClick={handleClearCompleted}
        >
          Clear completed ({stats.completed})
        </button>
      )}
    </div>
  );
};
