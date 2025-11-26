import React from 'react';
import { useTodoStore } from '../store/useTodoStore';
import type { FilterType } from '../types';

/**
 * TodoFilters 組件
 * Zustand 優勢：簡潔的狀態訂閱和更新
 */
const TodoFilters: React.FC = () => {
  // 訂閱當前篩選器狀態
  const filter = useTodoStore((state) => state.filter);
  // 訂閱統計數據
  const stats = useTodoStore((state) => state.getStats());
  // 訂閱設置篩選器的方法
  const setFilter = useTodoStore((state) => state.setFilter);

  const handleFilterChange = (newFilter: FilterType) => {
    setFilter(newFilter);
  };

  return (
    <div className="filters">
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
  );
};

export default TodoFilters;
