import { memo } from 'preact/compat';
import type { Todo } from '../types';
import { toggleTodo, deleteTodo } from '../signals/todoSignals';

/**
 * Props for TodoItem component
 */
interface TodoItemProps {
  todo: Todo;
}

/**
 * TodoItem Component
 *
 * Displays a single todo item with checkbox and delete button.
 * Demonstrates:
 * - Component memoization with memo() for performance
 * - Props interface in TypeScript
 * - Conditional CSS classes
 * - Event handling
 * - Integration with signal actions
 *
 * This component is memoized to prevent unnecessary re-renders.
 * It only re-renders when the todo prop changes.
 */
export const TodoItem = memo(function TodoItem({ todo }: TodoItemProps) {
  /**
   * Handle checkbox toggle
   */
  const handleToggle = () => {
    toggleTodo(todo.id);
  };

  /**
   * Handle delete button click
   */
  const handleDelete = () => {
    deleteTodo(todo.id);
  };

  return (
    <li className="todo-item">
      <input
        type="checkbox"
        className="todo-checkbox"
        checked={todo.completed}
        onChange={handleToggle}
        aria-label={`Mark "${todo.text}" as ${
          todo.completed ? 'incomplete' : 'complete'
        }`}
      />
      <span className={`todo-text ${todo.completed ? 'completed' : ''}`}>
        {todo.text}
      </span>
      <button
        className="btn-delete"
        onClick={handleDelete}
        aria-label={`Delete "${todo.text}"`}
      >
        Delete
      </button>
    </li>
  );
});
