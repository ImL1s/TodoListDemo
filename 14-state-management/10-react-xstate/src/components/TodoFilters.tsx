import React from 'react';
import { FilterType } from '../types/todo';

interface TodoFiltersProps {
  currentFilter: FilterType;
  activeCount: number;
  completedCount: number;
  onFilterChange: (filter: FilterType) => void;
  onClearCompleted: () => void;
}

export const TodoFilters: React.FC<TodoFiltersProps> = ({
  currentFilter,
  activeCount,
  completedCount,
  onFilterChange,
  onClearCompleted,
}) => {
  const filters: { value: FilterType; label: string }[] = [
    { value: 'all', label: 'All' },
    { value: 'active', label: 'Active' },
    { value: 'completed', label: 'Completed' },
  ];

  return (
    <div className="todo-filters">
      <div className="todo-count">
        <strong>{activeCount}</strong> {activeCount === 1 ? 'item' : 'items'} left
      </div>

      <div className="filter-buttons">
        {filters.map((filter) => (
          <button
            key={filter.value}
            className={`filter-button ${
              currentFilter === filter.value ? 'active' : ''
            }`}
            onClick={() => onFilterChange(filter.value)}
          >
            {filter.label}
          </button>
        ))}
      </div>

      {completedCount > 0 && (
        <button className="clear-completed" onClick={onClearCompleted}>
          Clear completed
        </button>
      )}
    </div>
  );
};
