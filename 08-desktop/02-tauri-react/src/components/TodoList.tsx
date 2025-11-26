import TodoItem from './TodoItem';
import { TodoListProps } from '../types';

/**
 * TodoList Component
 * Renders a list of todo items or an empty state
 * Passes callbacks down to TodoItem components
 */
function TodoList({ todos, onToggle, onDelete }: TodoListProps) {
  if (todos.length === 0) {
    return (
      <div className="todo-list">
        <div className="empty-state">
          <div className="empty-state-icon">📭</div>
          <p>No todos yet!</p>
          <small>Add your first todo above to get started</small>
        </div>
      </div>
    );
  }

  return (
    <div className="todo-list">
      {todos.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onToggle={onToggle}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}

export default TodoList;
