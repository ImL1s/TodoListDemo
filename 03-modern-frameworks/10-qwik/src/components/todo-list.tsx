import { component$, type QRL } from '@builder.io/qwik';
import type { Todo } from '../routes';
import { TodoItem } from './todo-item';

interface TodoListProps {
  todos: Todo[];
  onToggle$: QRL<(id: number) => void>;
  onDelete$: QRL<(id: number) => void>;
  onEdit$: QRL<(id: number, text: string) => void>;
}

export const TodoList = component$<TodoListProps>(
  ({ todos, onToggle$, onDelete$, onEdit$ }) => {
    return (
      <div class="divide-y divide-gray-200">
        {todos.map((todo) => (
          <TodoItem
            key={todo.id}
            todo={todo}
            onToggle$={onToggle$}
            onDelete$={onDelete$}
            onEdit$={onEdit$}
          />
        ))}
      </div>
    );
  }
);
