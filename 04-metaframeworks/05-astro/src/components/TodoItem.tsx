import type { Todo } from './TodoList';

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

// React component for individual todo item
export default function TodoItem({ todo, onToggle, onDelete }: TodoItemProps) {
  return (
    <div className={`todo-item ${todo.completed ? 'completed' : ''}`}>
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={() => onToggle(todo.id)}
        className="todo-checkbox"
      />
      <span className="todo-text">{todo.text}</span>
      <button
        onClick={() => onDelete(todo.id)}
        className="btn btn-delete"
      >
        刪除
      </button>
    </div>
  );
}
