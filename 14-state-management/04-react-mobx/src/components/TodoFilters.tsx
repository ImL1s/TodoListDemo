/**
 * TodoFilters Component - 篩選器組件
 *
 * 展示 MobX 的響應式更新：
 * - 當 filter 變化時，組件自動重渲染
 * - 使用 computed values (stats) 獲取統計數據
 */

import { observer } from 'mobx-react-lite';
import { FilterType } from '../types';
import { todoStore } from '../stores/TodoStore';

const TodoFilters = observer(() => {
  const { filter, stats, hasCompletedTodos } = todoStore;

  const handleFilterChange = (newFilter: FilterType) => {
    todoStore.setFilter(newFilter);
  };

  const handleClearCompleted = () => {
    todoStore.clearCompleted();
  };

  return (
    <div className="todo-filters">
      <div className="filter-buttons">
        <button
          className={`filter-button ${filter === 'all' ? 'active' : ''}`}
          onClick={() => handleFilterChange('all')}
        >
          全部 ({stats.total})
        </button>
        <button
          className={`filter-button ${filter === 'active' ? 'active' : ''}`}
          onClick={() => handleFilterChange('active')}
        >
          進行中 ({stats.active})
        </button>
        <button
          className={`filter-button ${filter === 'completed' ? 'active' : ''}`}
          onClick={() => handleFilterChange('completed')}
        >
          已完成 ({stats.completed})
        </button>
      </div>

      {hasCompletedTodos && (
        <button className="clear-completed" onClick={handleClearCompleted}>
          清除已完成
        </button>
      )}
    </div>
  );
});

TodoFilters.displayName = 'TodoFilters';

export default TodoFilters;
