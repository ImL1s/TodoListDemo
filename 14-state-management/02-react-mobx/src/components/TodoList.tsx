import { observer } from 'mobx-react-lite';
import { todoStore } from '../stores/TodoStore';
import TodoItem from './TodoItem';

/**
 * TodoList - Todo 列表組件
 *
 * observer: 使組件響應 MobX store 的變化
 * 當 filteredTodos 的依賴（todos 或 filter）改變時，組件自動重新渲染
 *
 * MobX 的優勢：
 * 1. 不需要手動訂閱/取消訂閱
 * 2. 細粒度的更新，只有真正改變的數據才觸發重新渲染
 * 3. 自動追蹤依賴，無需手動聲明
 */
const TodoList = observer(() => {
  // 使用 computed value，MobX 會自動追蹤依賴並緩存結果
  const filteredTodos = todoStore.filteredTodos;

  if (filteredTodos.length === 0) {
    return (
      <div className="empty-state">
        <p>
          {todoStore.filter === 'active' && '沒有進行中的任務'}
          {todoStore.filter === 'completed' && '沒有已完成的任務'}
          {todoStore.filter === 'all' && '還沒有任何任務，開始新增吧！'}
        </p>
      </div>
    );
  }

  return (
    <ul className="todo-list">
      {filteredTodos.map((todo) => (
        // 每個 TodoItem 都是獨立的 observer
        // 只有當特定 todo 改變時，對應的 TodoItem 才會重新渲染
        <TodoItem key={todo.id} todo={todo} />
      ))}
    </ul>
  );
});

export default TodoList;
