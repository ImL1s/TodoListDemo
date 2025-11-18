import type { Todo } from '~/utils/todo.server';
import TodoItem from './TodoItem';

interface TodoListProps {
  todos: Todo[];
  filter: 'all' | 'active' | 'completed';
}

export default function TodoList({ todos, filter }: TodoListProps) {
  if (todos.length === 0) {
    return (
      <div className="card">
        <div className="empty-state">
          <div className="empty-state-icon" aria-hidden="true">
            {filter === 'completed' ? '✅' : '📝'}
          </div>
          <h3 className="empty-state-title">
            {filter === 'completed'
              ? 'No completed todos'
              : filter === 'active'
              ? 'No active todos'
              : 'No todos yet'}
          </h3>
          <p className="empty-state-text">
            {filter === 'completed'
              ? 'Complete some todos to see them here'
              : filter === 'active'
              ? 'All todos are completed!'
              : 'Add your first todo to get started'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <ul className="todo-list" role="list">
        {todos.map(todo => (
          <TodoItem key={todo.id} todo={todo} />
        ))}
      </ul>
    </div>
  );
}
