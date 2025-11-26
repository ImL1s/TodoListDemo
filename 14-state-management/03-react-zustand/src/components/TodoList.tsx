import React from 'react';
import TodoItem from './TodoItem';
import { useTodoStore } from '../store/useTodoStore';

/**
 * TodoList 組件
 * Zustand 優勢：使用選擇器獲取派生狀態
 */
const TodoList: React.FC = () => {
  // Zustand：使用 store 中的選擇器獲取過濾後的待辦事項
  // 這種方式比在組件中計算更高效
  const filteredTodos = useTodoStore((state) => state.getFilteredTodos());

  if (filteredTodos.length === 0) {
    return (
      <div className="empty-state">
        <p>暫無待辦事項</p>
        <p className="empty-hint">添加一個新的待辦事項開始吧！</p>
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
};

export default TodoList;
