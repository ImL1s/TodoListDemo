import { observer } from 'mobx-react-lite';
import { todoStore } from '../stores/TodoStore';
import type { FilterType } from '../types/todo';

/**
 * TodoFilters - 過濾器組件
 *
 * 展示 MobX 的響應式特性：
 * - 當 filter 改變時，按鈕的 active 狀態會自動更新
 * - 當 counts 改變時，數字會自動更新
 */
const TodoFilters = observer(() => {
  const filters: { label: string; value: FilterType }[] = [
    { label: '全部', value: 'all' },
    { label: '進行中', value: 'active' },
    { label: '已完成', value: 'completed' },
  ];

  return (
    <div className="todo-filters">
      <div className="filter-buttons">
        {filters.map((filter) => (
          <button
            key={filter.value}
            className={`filter-button ${
              todoStore.filter === filter.value ? 'active' : ''
            }`}
            onClick={() => todoStore.setFilter(filter.value)}
          >
            {filter.label}
          </button>
        ))}
      </div>

      {todoStore.hasCompleted && (
        <button
          className="clear-completed-button"
          onClick={() => todoStore.clearCompleted()}
        >
          清除已完成 ({todoStore.completedCount})
        </button>
      )}
    </div>
  );
});

export default TodoFilters;
