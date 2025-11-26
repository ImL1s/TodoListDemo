import { useState, useRef, useEffect, KeyboardEvent } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import {
  toggleTodo,
  deleteTodo,
  startEditing,
  cancelEditing,
  updateTodo,
  selectEditingId,
} from './todosSlice';
import type { Todo } from '../../types/todo';

interface TodoItemProps {
  todo: Todo;
}

/**
 * Todo 項目組件
 * 顯示單個 todo 項目，支援編輯、刪除、切換完成狀態
 */
export function TodoItem({ todo }: TodoItemProps) {
  const dispatch = useAppDispatch();
  const editingId = useAppSelector(selectEditingId);
  const isEditing = editingId === todo.id;

  const [editText, setEditText] = useState(todo.text);
  const inputRef = useRef<HTMLInputElement>(null);

  // 當進入編輯模式時，聚焦輸入框
  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleToggle = () => {
    dispatch(toggleTodo(todo.id));
  };

  const handleDelete = () => {
    dispatch(deleteTodo(todo.id));
  };

  const handleStartEdit = () => {
    setEditText(todo.text);
    dispatch(startEditing(todo.id));
  };

  const handleCancelEdit = () => {
    setEditText(todo.text);
    dispatch(cancelEditing());
  };

  const handleSaveEdit = () => {
    const trimmedText = editText.trim();
    if (trimmedText) {
      dispatch(updateTodo({ id: todo.id, text: trimmedText }));
    } else {
      handleCancelEdit();
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSaveEdit();
    } else if (e.key === 'Escape') {
      handleCancelEdit();
    }
  };

  if (isEditing) {
    return (
      <li className="todo-item editing">
        <div className="todo-edit-container">
          <input
            ref={inputRef}
            type="text"
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            onBlur={handleSaveEdit}
            onKeyDown={handleKeyDown}
            className="todo-edit-input"
          />
          <div className="todo-edit-actions">
            <button onClick={handleSaveEdit} className="btn-save" title="儲存 (Enter)">
              💾
            </button>
            <button onClick={handleCancelEdit} className="btn-cancel" title="取消 (Esc)">
              ✖
            </button>
          </div>
        </div>
      </li>
    );
  }

  return (
    <li className={`todo-item ${todo.completed ? 'completed' : ''}`}>
      <div className="todo-content">
        <input
          type="checkbox"
          checked={todo.completed}
          onChange={handleToggle}
          className="todo-checkbox"
        />
        <span className="todo-text" onDoubleClick={handleStartEdit}>
          {todo.text}
        </span>
      </div>
      <div className="todo-actions">
        <button onClick={handleStartEdit} className="btn-edit" title="編輯">
          ✏️
        </button>
        <button onClick={handleDelete} className="btn-delete" title="刪除">
          🗑️
        </button>
      </div>
    </li>
  );
}
