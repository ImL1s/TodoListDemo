import { useState, ChangeEvent, KeyboardEvent } from 'react';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { todosState, editingTodoIdState } from '../state/atoms';
import { Todo } from '../types';

interface TodoItemProps {
  todo: Todo;
}

/**
 * TodoItem Component
 * Displays a single todo with edit, delete, and toggle complete functionality
 */
export function TodoItem({ todo }: TodoItemProps) {
  const [todos, setTodos] = useRecoilState(todosState);
  const [editingTodoId, setEditingTodoId] = useRecoilState(editingTodoIdState);
  const [editText, setEditText] = useState(todo.text);

  const isEditing = editingTodoId === todo.id;

  const toggleComplete = () => {
    setTodos((prevTodos) =>
      prevTodos.map((t) =>
        t.id === todo.id
          ? { ...t, completed: !t.completed, updatedAt: Date.now() }
          : t
      )
    );
  };

  const deleteTodo = () => {
    setTodos((prevTodos) => prevTodos.filter((t) => t.id !== todo.id));
  };

  const startEditing = () => {
    setEditingTodoId(todo.id);
    setEditText(todo.text);
  };

  const cancelEditing = () => {
    setEditingTodoId(null);
    setEditText(todo.text);
  };

  const saveEdit = () => {
    const trimmedText = editText.trim();
    if (!trimmedText) {
      deleteTodo();
      return;
    }

    setTodos((prevTodos) =>
      prevTodos.map((t) =>
        t.id === todo.id
          ? { ...t, text: trimmedText, updatedAt: Date.now() }
          : t
      )
    );
    setEditingTodoId(null);
  };

  const handleEditChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEditText(e.target.value);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      saveEdit();
    } else if (e.key === 'Escape') {
      cancelEditing();
    }
  };

  const getPriorityClass = () => {
    switch (todo.priority) {
      case 'high':
        return 'priority-high';
      case 'medium':
        return 'priority-medium';
      case 'low':
        return 'priority-low';
      default:
        return '';
    }
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <li className={`todo-item ${todo.completed ? 'completed' : ''} ${getPriorityClass()}`}>
      <div className="todo-content">
        <input
          type="checkbox"
          checked={todo.completed}
          onChange={toggleComplete}
          className="todo-checkbox"
        />

        {isEditing ? (
          <input
            type="text"
            value={editText}
            onChange={handleEditChange}
            onKeyDown={handleKeyDown}
            onBlur={saveEdit}
            className="todo-edit-input"
            autoFocus
          />
        ) : (
          <div className="todo-details" onDoubleClick={startEditing}>
            <span className="todo-text">{todo.text}</span>
            {todo.category && (
              <span className="todo-category">{todo.category}</span>
            )}
            {todo.priority && (
              <span className={`todo-priority priority-${todo.priority}`}>
                {todo.priority}
              </span>
            )}
            <span className="todo-date">{formatDate(todo.createdAt)}</span>
          </div>
        )}
      </div>

      {!isEditing && (
        <div className="todo-actions">
          <button
            onClick={startEditing}
            className="edit-button"
            title="Edit todo"
          >
            Edit
          </button>
          <button
            onClick={deleteTodo}
            className="delete-button"
            title="Delete todo"
          >
            Delete
          </button>
        </div>
      )}
    </li>
  );
}
