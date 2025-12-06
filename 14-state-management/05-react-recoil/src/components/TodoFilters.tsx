import { ChangeEvent } from 'react';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import {
  filterState,
  sortTypeState,
  sortDirectionState,
  searchQueryState,
  todosState,
} from '../state/atoms';
import { todoStatsState, urgentTodosState } from '../state/selectors';
import { FilterType, SortType } from '../types';

/**
 * TodoFilters Component
 * Provides UI controls for filtering, sorting, searching, and viewing statistics
 */
export function TodoFilters() {
  const [filter, setFilter] = useRecoilState(filterState);
  const [sortType, setSortType] = useRecoilState(sortTypeState);
  const [sortDirection, setSortDirection] = useRecoilState(sortDirectionState);
  const [searchQuery, setSearchQuery] = useRecoilState(searchQueryState);
  const setTodos = useSetRecoilState(todosState);

  // Using selectors to get derived state
  const stats = useRecoilValue(todoStatsState);
  const urgentTodos = useRecoilValue(urgentTodosState);

  const handleFilterChange = (newFilter: FilterType) => {
    setFilter(newFilter);
  };

  const handleSortTypeChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setSortType(e.target.value as SortType);
  };

  const handleSortDirectionToggle = () => {
    setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
  };

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const clearCompleted = () => {
    setTodos((prevTodos) => prevTodos.filter((todo) => !todo.completed));
  };

  const completeAll = () => {
    setTodos((prevTodos) =>
      prevTodos.map((todo) => ({
        ...todo,
        completed: true,
        updatedAt: Date.now(),
      }))
    );
  };

  const clearAll = () => {
    if (window.confirm('Are you sure you want to delete all todos?')) {
      setTodos([]);
    }
  };

  return (
    <div className="todo-filters">
      {/* Statistics Section */}
      <div className="stats-section">
        <h3>Statistics</h3>
        <div className="stats-grid">
          <div className="stat-item">
            <span className="stat-label">Total:</span>
            <span className="stat-value">{stats.total}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Active:</span>
            <span className="stat-value">{stats.active}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Completed:</span>
            <span className="stat-value">{stats.completed}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Completion Rate:</span>
            <span className="stat-value">{stats.completionRate.toFixed(1)}%</span>
          </div>
          {urgentTodos.length > 0 && (
            <div className="stat-item urgent">
              <span className="stat-label">Urgent:</span>
              <span className="stat-value">{urgentTodos.length}</span>
            </div>
          )}
        </div>
      </div>

      {/* Search Section */}
      <div className="search-section">
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearchChange}
          placeholder="Search todos..."
          className="search-input"
        />
      </div>

      {/* Filter Section */}
      <div className="filter-section">
        <h4>Filter by Status</h4>
        <div className="filter-buttons">
          <button
            onClick={() => handleFilterChange('all')}
            className={`filter-button ${filter === 'all' ? 'active' : ''}`}
          >
            All ({stats.total})
          </button>
          <button
            onClick={() => handleFilterChange('active')}
            className={`filter-button ${filter === 'active' ? 'active' : ''}`}
          >
            Active ({stats.active})
          </button>
          <button
            onClick={() => handleFilterChange('completed')}
            className={`filter-button ${filter === 'completed' ? 'active' : ''}`}
          >
            Completed ({stats.completed})
          </button>
        </div>
      </div>

      {/* Sort Section */}
      <div className="sort-section">
        <h4>Sort By</h4>
        <div className="sort-controls">
          <select
            value={sortType}
            onChange={handleSortTypeChange}
            className="sort-select"
          >
            <option value="createdAt">Date Created</option>
            <option value="priority">Priority</option>
            <option value="text">Text (A-Z)</option>
          </select>
          <button
            onClick={handleSortDirectionToggle}
            className="sort-direction-button"
            title={`Sort ${sortDirection === 'asc' ? 'ascending' : 'descending'}`}
          >
            {sortDirection === 'asc' ? '↑ Ascending' : '↓ Descending'}
          </button>
        </div>
      </div>

      {/* Bulk Actions Section */}
      <div className="bulk-actions-section">
        <h4>Bulk Actions</h4>
        <div className="bulk-actions">
          <button
            onClick={completeAll}
            disabled={stats.total === 0}
            className="action-button"
          >
            Complete All
          </button>
          <button
            onClick={clearCompleted}
            disabled={stats.completed === 0}
            className="action-button"
          >
            Clear Completed
          </button>
          <button
            onClick={clearAll}
            disabled={stats.total === 0}
            className="action-button danger"
          >
            Clear All
          </button>
        </div>
      </div>
    </div>
  );
}
