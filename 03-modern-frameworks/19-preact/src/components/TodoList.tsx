import { TodoItem } from './TodoItem';
import { filteredTodosSignal } from '../signals/todoSignals';

/**
 * TodoList Component
 *
 * Displays the list of filtered todos.
 * Demonstrates:
 * - Using computed signals for reactive filtering
 * - Conditional rendering (empty state)
 * - Rendering lists with keys
 * - Signal reactivity - automatically re-renders when filteredTodosSignal changes
 *
 * Note: No useState or useEffect needed! The component automatically
 * re-renders when the signal value changes.
 */
export function TodoList() {
  // Access the computed signal directly
  // The component will automatically re-render when this signal changes
  const todos = filteredTodosSignal.value;

  // Show empty state if no todos match the current filter
  if (todos.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-state-icon">📝</div>
        <p>No todos to display</p>
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
