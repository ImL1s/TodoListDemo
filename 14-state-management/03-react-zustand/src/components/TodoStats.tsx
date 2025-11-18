import React from 'react';
import { useTodoStore } from '../store/useTodoStore';

/**
 * TodoStats 組件
 * Zustand 優勢：使用選擇器獲取計算屬性
 */
const TodoStats: React.FC = () => {
  // 使用 store 中的選擇器獲取統計數據
  const stats = useTodoStore((state) => state.getStats());

  return (
    <div className="stats">
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
  );
};

export default TodoStats;
