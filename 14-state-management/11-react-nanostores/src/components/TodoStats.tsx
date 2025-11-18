/**
 * TodoStats Component
 * Demonstrates:
 * - Multiple useStore hooks
 * - Computed stores for derived state
 * - Conditional rendering based on store state
 */

import { useStore } from '@nanostores/react';
import { $stats, clearCompleted, toggleAll } from '../stores/todoStore';

export function TodoStats() {
  const stats = useStore($stats); // Subscribe to computed stats

  const hasTodos = stats.total > 0;
  const hasCompleted = stats.completed > 0;

  if (!hasTodos) {
    return null;
  }

  return (
    <div className="todo-stats">
      <div className="stats-info">
        <span className="stat-item">
          <strong>{stats.total}</strong> total
        </span>
        <span className="stat-item">
          <strong>{stats.active}</strong> active
        </span>
        <span className="stat-item">
          <strong>{stats.completed}</strong> completed
        </span>
      </div>

      <div className="stats-actions">
        <button
          className="action-button toggle-all"
          onClick={toggleAll}
          title={stats.active > 0 ? 'Complete all' : 'Activate all'}
        >
          {stats.active > 0 ? '☑ Complete All' : '☐ Activate All'}
        </button>

        {hasCompleted && (
          <button
            className="action-button clear-completed"
            onClick={clearCompleted}
          >
            🗑 Clear Completed
          </button>
        )}
      </div>
    </div>
  );
}
