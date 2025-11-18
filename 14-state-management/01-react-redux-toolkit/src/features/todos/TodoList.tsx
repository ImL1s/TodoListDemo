import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { loadTodos, selectFilteredTodos, toggleAll, selectAllTodos } from './todosSlice';
import { TodoItem } from './TodoItem';

/**
 * Todo 列表組件
 * 顯示已篩選的 todo 列表
 */
export function TodoList() {
  const dispatch = useAppDispatch();
  const filteredTodos = useAppSelector(selectFilteredTodos);
  const allTodos = useAppSelector(selectAllTodos);

  // 組件掛載時載入 todos
  useEffect(() => {
    dispatch(loadTodos());
  }, [dispatch]);

  const allCompleted = allTodos.length > 0 && allTodos.every(todo => todo.completed);

  const handleToggleAll = () => {
    dispatch(toggleAll(!allCompleted));
  };

  if (filteredTodos.length === 0) {
    return (
      <div className="todo-list-empty">
        <p>暫無待辦事項</p>
      </div>
    );
  }

  return (
    <div className="todo-list-container">
      {allTodos.length > 0 && (
        <div className="toggle-all-container">
          <input
            type="checkbox"
            id="toggle-all"
            checked={allCompleted}
            onChange={handleToggleAll}
            className="toggle-all-checkbox"
          />
          <label htmlFor="toggle-all" className="toggle-all-label">
            全部標記為{allCompleted ? '未完成' : '完成'}
          </label>
        </div>
      )}

      <ul className="todo-list">
        {filteredTodos.map(todo => (
          <TodoItem key={todo.id} todo={todo} />
        ))}
      </ul>
    </div>
  );
}
