/**
 * TodoList Component
 * Demonstrates:
 * - useStore with computed stores
 * - Efficient re-renders (only when filtered todos change)
 */

import { useStore } from '@nanostores/react';
import { $sortedFilteredTodos } from '../stores/todoStore';
import { TodoItem } from './TodoItem';

export function TodoList() {
  // Subscribe to computed store - only re-renders when filtered todos change!
  const todos = useStore($sortedFilteredTodos);

  if (todos.length === 0) {
    return (
      <div className="empty-state">
        <p>No todos yet. Add one above!</p>
      </div>
    );
  }

  return (
    <ul className="todo-list">
      {todos.map((todo) => (
        <TodoItem key={todo.id} todo={todo} />
      ))}
    </ul>
  );
}
