/**
 * TodoList Component
 *
 * Demonstrates:
 * - useSnapshot for reading Valtio state
 * - Automatic re-rendering when state changes
 * - Using derived computed values
 */

import React from 'react';
import { useSnapshot } from 'valtio';
import { todoState, todoStats, todoActions, getFilteredTodos } from '../store/todoStore';
import { TodoItem } from './TodoItem';

export const TodoList: React.FC = () => {
  // useSnapshot creates an immutable snapshot of the state
  // The component re-renders when accessed properties change
  const snapshot = useSnapshot(todoState);
  const stats = useSnapshot(todoStats);

  // Get filtered todos based on current filter
  const filteredTodos = getFilteredTodos();

  const allCompleted = stats.total > 0 && stats.active === 0;

  const handleToggleAll = () => {
    // Toggle all todos based on current state
    todoActions.toggleAll(!allCompleted);
  };

  if (stats.total === 0) {
    return (
      <div className="todo-list-empty">
        <p>No todos yet. Add one above to get started!</p>
      </div>
    );
  }

  return (
    <div className="todo-list-container">
      <div className="todo-list-header">
        <label className="toggle-all-label">
          <input
            type="checkbox"
            className="toggle-all"
            checked={allCompleted}
            onChange={handleToggleAll}
          />
          <span>Toggle All</span>
        </label>
      </div>

      <ul className="todo-list">
        {filteredTodos.map(todo => (
          <TodoItem key={todo.id} todo={todo} />
        ))}
      </ul>

      {filteredTodos.length === 0 && snapshot.filter !== 'all' && (
        <div className="no-todos-message">
          <p>No {snapshot.filter} todos</p>
        </div>
      )}
    </div>
  );
};
