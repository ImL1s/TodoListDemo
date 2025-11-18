import React from 'react';
import { TodoItem } from './TodoItem';
import type { TodoListProps } from '../types';

/**
 * TodoList Component
 *
 * Renders a list of todos with empty state handling
 */
export const TodoList: React.FC<TodoListProps> = ({
  todos,
  onToggle,
  onDelete,
  onEdit,
}) => {
  if (todos.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-icon">📝</div>
        <p className="empty-text">No todos yet</p>
        <p className="empty-subtext">Add a todo to get started!</p>

        <style>{`
          .empty-state {
            text-align: center;
            padding: 60px 20px;
            color: #9ca3af;
          }

          .empty-icon {
            font-size: 64px;
            margin-bottom: 16px;
            opacity: 0.5;
          }

          .empty-text {
            font-size: 20px;
            font-weight: 600;
            color: #6b7280;
            margin-bottom: 8px;
          }

          .empty-subtext {
            font-size: 14px;
            color: #9ca3af;
          }
        `}</style>
      </div>
    );
  }

  return (
    <ul className="todo-list">
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onToggle={onToggle}
          onDelete={onDelete}
          onEdit={onEdit}
        />
      ))}

      <style>{`
        .todo-list {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
      `}</style>
    </ul>
  );
};
