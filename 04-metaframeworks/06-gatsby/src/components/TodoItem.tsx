import React, { useState, KeyboardEvent, useRef, useEffect } from 'react';
import type { TodoItemProps } from '../types';

/**
 * TodoItem Component
 *
 * Individual todo item with toggle, edit, and delete functionality
 */
export const TodoItem: React.FC<TodoItemProps> = ({
  todo,
  onToggle,
  onDelete,
  onEdit,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(todo.text);
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input when entering edit mode
  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleEdit = () => {
    setIsEditing(true);
    setEditText(todo.text);
  };

  const handleSave = () => {
    if (editText.trim()) {
      onEdit(todo.id, editText);
      setIsEditing(false);
    } else {
      onDelete(todo.id);
    }
  };

  const handleCancel = () => {
    setEditText(todo.text);
    setIsEditing(false);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  if (isEditing) {
    return (
      <li className="todo-item editing">
        <input
          ref={inputRef}
          type="text"
          value={editText}
          onChange={(e) => setEditText(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={handleSave}
          className="edit-input"
          aria-label="Edit todo"
        />

        <style>{`
          .todo-item.editing {
            padding: 0;
          }

          .edit-input {
            width: 100%;
            padding: 16px;
            font-size: 16px;
            border: 2px solid #4f46e5;
            border-radius: 12px;
            font-family: inherit;
          }

          .edit-input:focus {
            outline: none;
            box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
          }
        `}</style>
      </li>
    );
  }

  return (
    <li className={`todo-item ${todo.completed ? 'completed' : ''}`}>
      <div className="todo-content">
        <input
          type="checkbox"
          checked={todo.completed}
          onChange={() => onToggle(todo.id)}
          className="todo-checkbox"
          aria-label={`Mark "${todo.text}" as ${todo.completed ? 'incomplete' : 'complete'}`}
        />
        <span
          className="todo-text"
          onDoubleClick={handleEdit}
          title="Double-click to edit"
        >
          {todo.text}
        </span>
      </div>

      <div className="todo-actions">
        <button
          onClick={handleEdit}
          className="edit-button"
          aria-label="Edit todo"
          title="Edit"
        >
          ✏️
        </button>
        <button
          onClick={() => onDelete(todo.id)}
          className="delete-button"
          aria-label="Delete todo"
          title="Delete"
        >
          🗑️
        </button>
      </div>

      <style>{`
        .todo-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px;
          background: white;
          border-radius: 12px;
          border: 2px solid #f3f4f6;
          transition: all 0.2s;
        }

        .todo-item:hover {
          border-color: #e5e7eb;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
        }

        .todo-item.completed {
          background: #f9fafb;
          opacity: 0.7;
        }

        .todo-content {
          display: flex;
          align-items: center;
          gap: 12px;
          flex: 1;
          min-width: 0;
        }

        .todo-checkbox {
          width: 20px;
          height: 20px;
          cursor: pointer;
          accent-color: #4f46e5;
        }

        .todo-text {
          flex: 1;
          font-size: 16px;
          color: #1f2937;
          word-break: break-word;
          cursor: pointer;
          user-select: none;
        }

        .todo-item.completed .todo-text {
          text-decoration: line-through;
          color: #9ca3af;
        }

        .todo-actions {
          display: flex;
          gap: 8px;
          opacity: 0;
          transition: opacity 0.2s;
        }

        .todo-item:hover .todo-actions {
          opacity: 1;
        }

        .edit-button,
        .delete-button {
          padding: 6px 10px;
          font-size: 16px;
          background: transparent;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .edit-button:hover {
          background: #f3f4f6;
        }

        .delete-button:hover {
          background: #fee2e2;
        }

        @media (max-width: 640px) {
          .todo-actions {
            opacity: 1;
          }

          .edit-button,
          .delete-button {
            padding: 8px 12px;
          }
        }
      `}</style>
    </li>
  );
};
