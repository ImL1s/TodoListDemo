/**
 * TodoItem Component - 單個待辦事項組件
 *
 * 展示 MobX 的細粒度更新：
 * - observer HOC 確保只有相關的 todo 變化時才重渲染
 * - 直接調用 store 的 action 方法修改狀態
 */

import { observer } from 'mobx-react-lite';
import { useState } from 'react';
import { Todo } from '../types';
import { todoStore } from '../stores/TodoStore';

interface TodoItemProps {
  todo: Todo;
}

const TodoItem = observer(({ todo }: TodoItemProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(todo.text);

  const handleToggle = () => {
    todoStore.toggleTodo(todo.id);
  };

  const handleDelete = () => {
    todoStore.deleteTodo(todo.id);
  };

  const handleEdit = () => {
    setIsEditing(true);
    setEditText(todo.text);
  };

  const handleSave = () => {
    if (editText.trim()) {
      todoStore.editTodo(todo.id, editText);
      setIsEditing(false);
    } else {
      handleDelete();
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditText(todo.text);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString('zh-TW', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (isEditing) {
    return (
      <li className="todo-item editing">
        <input
          type="text"
          className="edit-input"
          value={editText}
          onChange={(e) => setEditText(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={handleSave}
          autoFocus
        />
      </li>
    );
  }

  return (
    <li className={`todo-item ${todo.completed ? 'completed' : ''}`}>
      <div className="todo-content">
        <input
          type="checkbox"
          className="todo-checkbox"
          checked={todo.completed}
          onChange={handleToggle}
        />
        <span className="todo-text" onDoubleClick={handleEdit}>
          {todo.text}
        </span>
        <span className="todo-date">{formatDate(todo.createdAt)}</span>
      </div>
      <div className="todo-actions">
        <button className="edit-button" onClick={handleEdit} title="編輯">
          ✏️
        </button>
        <button className="delete-button" onClick={handleDelete} title="刪除">
          🗑️
        </button>
      </div>
    </li>
  );
});

TodoItem.displayName = 'TodoItem';

export default TodoItem;
