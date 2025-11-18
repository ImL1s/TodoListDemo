import { TodoItemProps } from '../types';

/**
 * TodoItem Component
 * Renders a single todo item with checkbox, text, timestamp, and delete button
 * Handles toggle and delete actions via callbacks
 */
function TodoItem({ todo, onToggle, onDelete }: TodoItemProps) {
  const formatTimestamp = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;

    return date.toLocaleDateString();
  };

  return (
    <div className={`todo-item ${todo.completed ? 'completed' : ''}`}>
      <input
        type="checkbox"
        className="todo-checkbox"
        checked={todo.completed}
        onChange={() => onToggle(todo.id)}
      />
      <span className="todo-text">{todo.text}</span>
      <span className="todo-timestamp">
        {formatTimestamp(todo.createdAt)}
      </span>
      <button
        className="delete-button"
        onClick={() => onDelete(todo.id)}
      >
        Delete
      </button>
    </div>
  );
}

export default TodoItem;
