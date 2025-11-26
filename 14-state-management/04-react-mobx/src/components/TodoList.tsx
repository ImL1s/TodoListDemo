/**
 * TodoList Component - 待辦事項列表組件
 *
 * 展示 MobX 的 computed values：
 * - 使用 store.filteredTodos 獲取過濾後的待辦事項
 * - MobX 自動緩存 computed 值，只在依賴變化時重新計算
 */

import { observer } from 'mobx-react-lite';
import { todoStore } from '../stores/TodoStore';
import TodoItem from './TodoItem';

const TodoList = observer(() => {
  const { filteredTodos } = todoStore;

  if (filteredTodos.length === 0) {
    return (
      <div className="empty-state">
        <p>🎉 沒有待辦事項！</p>
      </div>
    );
  }

  return (
    <ul className="todo-list">
      {filteredTodos.map((todo) => (
        <TodoItem key={todo.id} todo={todo} />
      ))}
    </ul>
  );
});

TodoList.displayName = 'TodoList';

export default TodoList;
