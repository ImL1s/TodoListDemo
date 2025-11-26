import React from 'react';
import TodoItem from './TodoItem';
import type { TodoListProps, Todo } from '../types';

/**
 * TodoList 組件 - 待辦事項列表容器
 * 展示 TypeScript 的數組類型和組件組合
 */
const TodoList: React.FC<TodoListProps> = ({
  todos,
  onToggleTodo,
  onDeleteTodo,
  onEditTodo
}) => {
  // TypeScript 確保 todos 是 Todo[] 類型
  if (todos.length === 0) {
    return (
      <div className="empty-state">
        <p>暫無待辦事項</p>
        <p className="empty-hint">添加一個新的待辦事項開始吧！</p>
      </div>
    );
  }

  return (
    <ul className="todo-list">
      {todos.map((todo: Todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onToggle={onToggleTodo}
          onDelete={onDeleteTodo}
          onEdit={onEditTodo}
        />
      ))}
    </ul>
  );
};

export default TodoList;
