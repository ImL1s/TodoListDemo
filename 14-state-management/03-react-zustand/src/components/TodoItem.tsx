import React, { useState } from 'react';
import { useTodoStore } from '../store/useTodoStore';
import type { Todo } from '../types';

interface TodoItemProps {
  todo: Todo;
}

/**
 * TodoItem 組件
 * Zustand 優勢：直接從 store 獲取方法，組件更簡潔
 */
const TodoItem: React.FC<TodoItemProps> = ({ todo }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(todo.text);

  // Zustand：選擇性訂閱需要的方法
  // 只訂閱方法，不訂閱狀態，組件不會因為其他狀態變化而重渲染
  const toggleTodo = useTodoStore((state) => state.toggleTodo);
  const deleteTodo = useTodoStore((state) => state.deleteTodo);
  const editTodo = useTodoStore((state) => state.editTodo);

  const handleEdit = () => {
    setIsEditing(true);
    setEditValue(todo.text);
  };

  const handleSave = () => {
    const trimmedValue = editValue.trim();
    if (trimmedValue && trimmedValue !== todo.text) {
      editTodo(todo.id, trimmedValue);
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditValue(todo.text);
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  const formatDate = (timestamp: number): string => {
    const date = new Date(timestamp);
    return date.toLocaleString('zh-TW', {
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <li className={`todo-item ${todo.completed ? 'completed' : ''}`}>
      <div className="todo-item-content">
        <input
          type="checkbox"
          checked={todo.completed}
          onChange={() => toggleTodo(todo.id)}
          className="todo-checkbox"
        />

        {isEditing ? (
          <input
            type="text"
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onKeyDown={handleKeyDown}
            className="todo-edit-input"
            autoFocus
          />
        ) : (
          <div className="todo-text-container">
            <span className="todo-text">{todo.text}</span>
            <span className="todo-date">
              創建於 {formatDate(todo.createdAt)}
              {todo.completedAt && ` • 完成於 ${formatDate(todo.completedAt)}`}
            </span>
          </div>
        )}
      </div>

      <div className="todo-actions">
        {isEditing ? (
          <>
            <button
              onClick={handleSave}
              className="save-button"
              title="保存"
            >
              ✓
            </button>
            <button
              onClick={handleCancel}
              className="cancel-button"
              title="取消"
            >
              ✕
            </button>
          </>
        ) : (
          <>
            <button
              onClick={handleEdit}
              className="edit-button"
              disabled={todo.completed}
              title="編輯"
            >
              ✎
            </button>
            <button
              onClick={() => deleteTodo(todo.id)}
              className="delete-button"
              title="刪除"
            >
              🗑
            </button>
          </>
        )}
      </div>
    </li>
  );
};

export default TodoItem;
