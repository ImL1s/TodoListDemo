import { observer } from 'mobx-react-lite';
import { todoStore } from '../stores/TodoStore';

/**
 * TodoStats - 統計信息組件
 *
 * 使用多個 computed values 展示實時統計
 * MobX 會自動追蹤所有使用的 observable，並在它們改變時更新組件
 *
 * Computed values 的優勢：
 * 1. 自動緩存，只在依賴改變時重新計算
 * 2. 可組合，一個 computed 可以依賴另一個 computed
 * 3. 延遲計算，只有在被使用時才執行
 */
const TodoStats = observer(() => {
  return (
    <div className="todo-stats">
      <div className="stats-item">
        <span className="stats-label">總計</span>
        <span className="stats-value">{todoStore.totalCount}</span>
      </div>
      <div className="stats-item">
        <span className="stats-label">進行中</span>
        <span className="stats-value active">{todoStore.activeCount}</span>
      </div>
      <div className="stats-item">
        <span className="stats-label">已完成</span>
        <span className="stats-value completed">{todoStore.completedCount}</span>
      </div>

      {todoStore.totalCount > 0 && (
        <div className="stats-item">
          <span className="stats-label">完成率</span>
          <span className="stats-value">
            {Math.round((todoStore.completedCount / todoStore.totalCount) * 100)}%
          </span>
        </div>
      )}
    </div>
  );
});

export default TodoStats;
