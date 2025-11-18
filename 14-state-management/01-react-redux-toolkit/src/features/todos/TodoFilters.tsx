import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { setFilter, clearCompleted, selectFilter, selectTodoStats } from './todosSlice';
import type { FilterType } from '../../types/todo';

/**
 * Todo 篩選器組件
 * 提供篩選按鈕和統計資訊
 */
export function TodoFilters() {
  const dispatch = useAppDispatch();
  const currentFilter = useAppSelector(selectFilter);
  const stats = useAppSelector(selectTodoStats);

  const handleFilterChange = (filter: FilterType) => {
    dispatch(setFilter(filter));
  };

  const handleClearCompleted = () => {
    if (stats.completed > 0) {
      dispatch(clearCompleted());
    }
  };

  const filters: { label: string; value: FilterType }[] = [
    { label: '全部', value: 'all' },
    { label: '進行中', value: 'active' },
    { label: '已完成', value: 'completed' },
  ];

  return (
    <div className="todo-filters">
      <div className="filter-buttons">
        {filters.map(filter => (
          <button
            key={filter.value}
            onClick={() => handleFilterChange(filter.value)}
            className={`filter-btn ${currentFilter === filter.value ? 'active' : ''}`}
          >
            {filter.label}
          </button>
        ))}
      </div>

      <div className="todo-stats">
        <span className="stat-item">
          總計: <strong>{stats.total}</strong>
        </span>
        <span className="stat-item">
          進行中: <strong>{stats.active}</strong>
        </span>
        <span className="stat-item">
          已完成: <strong>{stats.completed}</strong>
        </span>
      </div>

      {stats.completed > 0 && (
        <button onClick={handleClearCompleted} className="btn-clear-completed">
          清除已完成 ({stats.completed})
        </button>
      )}
    </div>
  );
}
