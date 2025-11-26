/**
 * TodoItem Component
 * Demonstrates:
 * - useStore hook from @nanostores/react
 * - Local state for editing
 * - Action dispatching
 */

import { useState, useRef, useEffect } from 'react';
import { useStore } from '@nanostores/react';
import {
  toggleTodo,
  deleteTodo,
  updateTodo,
  $editingId,
  setEditingId,
} from '../stores/todoStore';
import type { Todo } from '../types';

interface TodoItemProps {
  todo: Todo;
}

export function TodoItem({ todo }: TodoItemProps) {
  const editingId = useStore($editingId); // Subscribe to editingId atom
  const isEditing = editingId === todo.id;

  const [editText, setEditText] = useState(todo.text);
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input when editing starts
  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleDoubleClick = () => {
    setEditingId(todo.id);
    setEditText(todo.text);
  };

  const handleSave = () => {
    if (editText.trim()) {
      updateTodo(todo.id, editText);
    } else {
      deleteTodo(todo.id);
    }
    setEditingId(null);
  };

  const handleCancel = () => {
    setEditText(todo.text);
    setEditingId(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
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
          className="todo-edit-input"
          value={editText}
          onChange={(e) => setEditText(e.target.value)}
          onBlur={handleSave}
          onKeyDown={handleKeyDown}
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
          onChange={() => toggleTodo(todo.id)}
        />
        <span className="todo-text" onDoubleClick={handleDoubleClick}>
          {todo.text}
        </span>
        <button
          className="todo-delete"
          onClick={() => deleteTodo(todo.id)}
          aria-label="Delete todo"
        >
          ×
        </button>
      </div>
    </li>
  );
}
