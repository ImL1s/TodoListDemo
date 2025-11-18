import { useRecoilValue } from 'recoil';
import { sortedTodosState } from '../state/selectors';
import { TodoItem } from './TodoItem';

/**
 * TodoList Component
 * Displays the list of todos using the sortedTodosState selector
 * This component automatically updates when filters, search, or sort options change
 */
export function TodoList() {
  // Using selector that combines filtering, searching, and sorting
  const todos = useRecoilValue(sortedTodosState);

  if (todos.length === 0) {
    return (
      <div className="empty-state">
        <p>No todos found. Add one to get started!</p>
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
