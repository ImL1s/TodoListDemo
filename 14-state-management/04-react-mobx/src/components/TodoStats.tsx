/**
 * TodoStats Component - 統計組件
 *
 * 展示 MobX 的 computed values：
 * - stats 是 computed value，自動緩存
 * - 只有當 todos 變化時才重新計算
 */

import { observer } from 'mobx-react-lite';
import { todoStore } from '../stores/TodoStore';

const TodoStats = observer(() => {
  const { stats, allCompleted, todos } = todoStore;

  const handleToggleAll = () => {
    todoStore.toggleAll();
  };

  if (stats.total === 0) {
    return null;
  }

  const completionRate = Math.round((stats.completed / stats.total) * 100);

  return (
    <div className="todo-stats">
      <div className="stats-header">
        <h3>統計資訊</h3>
        {todos.length > 0 && (
          <button
            className={`toggle-all ${allCompleted ? 'all-completed' : ''}`}
            onClick={handleToggleAll}
            title={allCompleted ? '取消全部完成' : '標記全部完成'}
          >
            {allCompleted ? '✓' : '○'}
          </button>
        )}
      </div>
      <div className="stats-grid">
        <div className="stat-item">
          <span className="stat-label">總計</span>
          <span className="stat-value">{stats.total}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">進行中</span>
          <span className="stat-value active">{stats.active}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">已完成</span>
          <span className="stat-value completed">{stats.completed}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">完成率</span>
          <span className="stat-value">{completionRate}%</span>
        </div>
      </div>
      <div className="progress-bar">
        <div className="progress-fill" style={{ width: `${completionRate}%` }} />
      </div>
    </div>
  );
});

TodoStats.displayName = 'TodoStats';

export default TodoStats;
