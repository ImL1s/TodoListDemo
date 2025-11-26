import { useState } from 'preact/hooks';
import type { TodoItemProps } from '../types';
import type { JSX } from 'preact';

/**
 * TodoItem 組件 - 單個待辦事項的展示和編輯
 * 展示 Preact 的條件渲染和事件處理類型定義
 * 與 React 版本代碼幾乎完全相同
 */
const TodoItem = ({
  todo,
  onToggle,
  onDelete,
  onEdit
}: TodoItemProps) => {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editText, setEditText] = useState<string>(todo.text);

  // 處理保存編輯
  const handleSave = (): void => {
    const trimmedText = editText.trim();
    if (trimmedText && trimmedText !== todo.text) {
      onEdit(todo.id, trimmedText);
    } else if (!trimmedText) {
      setEditText(todo.text);
    }
    setIsEditing(false);
  };

  // 處理取消編輯
  const handleCancel = (): void => {
    setEditText(todo.text);
    setIsEditing(false);
  };

  // 鍵盤事件處理
  const handleKeyDown = (e: JSX.TargetedKeyboardEvent<HTMLInputElement>): void => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  // 輸入變化處理
  const handleChange = (e: JSX.TargetedEvent<HTMLInputElement, Event>): void => {
    setEditText(e.currentTarget.value);
  };

  // 格式化日期
  const formatDate = (timestamp: number): string => {
    return new Date(timestamp).toLocaleString('zh-TW', {
      year: 'numeric',
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
          onChange={() => onToggle(todo.id)}
          className="todo-checkbox"
          disabled={isEditing}
        />

        {isEditing ? (
          <input
            type="text"
            value={editText}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            onBlur={handleSave}
            className="todo-edit-input"
            autoFocus
          />
        ) : (
          <div className="todo-text-container">
            <span className="todo-text">{todo.text}</span>
            <span className="todo-date">
              {formatDate(todo.createdAt)}
              {todo.completed && todo.completedAt && (
                <> • 完成於 {formatDate(todo.completedAt)}</>
              )}
            </span>
          </div>
        )}
      </div>

      <div className="todo-actions">
        {!isEditing ? (
          <>
            <button
              onClick={() => setIsEditing(true)}
              className="edit-button"
              disabled={todo.completed}
              title="編輯"
            >
              ✏️
            </button>
            <button
              onClick={() => onDelete(todo.id)}
              className="delete-button"
              title="刪除"
            >
              🗑️
            </button>
          </>
        ) : (
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
        )}
      </div>
    </li>
  );
};

export default TodoItem;
