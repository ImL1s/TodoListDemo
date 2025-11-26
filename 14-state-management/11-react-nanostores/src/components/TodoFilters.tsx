/**
 * TodoFilters Component
 * Demonstrates:
 * - useStore with persistentAtom
 * - Action creators for updates
 */

import { useStore } from '@nanostores/react';
import { $filter, setFilter } from '../stores/todoStore';
import type { FilterType } from '../types';

const filters: { value: FilterType; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'active', label: 'Active' },
  { value: 'completed', label: 'Completed' },
];

export function TodoFilters() {
  const currentFilter = useStore($filter); // Subscribe to persistent atom

  return (
    <div className="todo-filters">
      {filters.map(({ value, label }) => (
        <button
          key={value}
          className={`filter-button ${currentFilter === value ? 'active' : ''}`}
          onClick={() => setFilter(value)}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
