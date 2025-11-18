/**
 * TodoItem Component
 *
 * Demonstrates:
 * - Direct mutations via todoActions
 * - No need for callbacks or event dispatchers
 * - Simple, imperative-style updates
 */

import React, { useState, ChangeEvent, KeyboardEvent } from 'react';
import { todoActions } from '../store/todoStore';
import type { Todo } from '../types';

interface TodoItemProps {
  todo: Todo;
}

export const TodoItem: React.FC<TodoItemProps> = ({ todo }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(todo.text);

  const handleToggle = () => {
    // Direct mutation - just call the action
    todoActions.toggleTodo(todo.id);
  };

  const handleDelete = () => {
    // Direct mutation - just call the action
    todoActions.deleteTodo(todo.id);
  };

  const handleEdit = () => {
    setIsEditing(true);
    setEditText(todo.text);
  };

  const handleSave = () => {
    if (editText.trim()) {
      // Direct mutation - just call the action
      todoActions.editTodo(todo.id, editText);
      setIsEditing(false);
    } else {
      // If empty, delete the todo
      handleDelete();
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditText(todo.text);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEditText(e.target.value);
  };

  if (isEditing) {
    return (
      <li className="todo-item editing">
        <div className="todo-content">
          <input
            type="text"
            className="todo-edit-input"
            value={editText}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            onBlur={handleSave}
            autoFocus
          />
        </div>
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
        <button
          className="delete-button"
          onClick={handleDelete}
          title="Delete todo"
        >
          ×
        </button>
      </div>
    </li>
  );
};
