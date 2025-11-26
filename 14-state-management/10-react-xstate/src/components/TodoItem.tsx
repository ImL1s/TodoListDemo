import React, { useState, useEffect, useRef, KeyboardEvent } from 'react';
import { Todo } from '../types/todo';

interface TodoItemProps {
  todo: Todo;
  isEditing: boolean;
  editText: string;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onStartEdit: (id: string, text: string) => void;
  onUpdate: (id: string, text: string) => void;
  onCancelEdit: () => void;
}

export const TodoItem: React.FC<TodoItemProps> = ({
  todo,
  isEditing,
  editText,
  onToggle,
  onDelete,
  onStartEdit,
  onUpdate,
  onCancelEdit,
}) => {
  const [localEditText, setLocalEditText] = useState(editText);
  const editInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setLocalEditText(editText);
  }, [editText]);

  useEffect(() => {
    if (isEditing && editInputRef.current) {
      editInputRef.current.focus();
      editInputRef.current.select();
    }
  }, [isEditing]);

  const handleUpdate = () => {
    if (localEditText.trim()) {
      onUpdate(todo.id, localEditText);
    } else {
      onCancelEdit();
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleUpdate();
    } else if (e.key === 'Escape') {
      onCancelEdit();
    }
  };

  if (isEditing) {
    return (
      <li className="todo-item editing">
        <input
          ref={editInputRef}
          type="text"
          className="edit-input"
          value={localEditText}
          onChange={(e) => setLocalEditText(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={handleUpdate}
        />
      </li>
    );
  }

  return (
    <li className={`todo-item ${todo.completed ? 'completed' : ''}`}>
      <div className="todo-item-content">
        <input
          type="checkbox"
          className="todo-checkbox"
          checked={todo.completed}
          onChange={() => onToggle(todo.id)}
        />
        <label
          className="todo-text"
          onDoubleClick={() => onStartEdit(todo.id, todo.text)}
        >
          {todo.text}
        </label>
        <button
          className="delete-button"
          onClick={() => onDelete(todo.id)}
          aria-label="Delete todo"
        >
          ×
        </button>
      </div>
    </li>
  );
};
