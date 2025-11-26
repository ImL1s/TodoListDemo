import { Form, useNavigation } from '@remix-run/react';
import type { Todo } from '~/utils/todo.server';

interface TodoItemProps {
  todo: Todo;
}

export default function TodoItem({ todo }: TodoItemProps) {
  const navigation = useNavigation();

  // Check if this specific todo is being toggled or deleted
  const isTogglingThis = navigation.state === 'submitting' &&
    navigation.formData?.get('_action') === 'toggle' &&
    navigation.formData?.get('id') === todo.id;

  const isDeletingThis = navigation.state === 'submitting' &&
    navigation.formData?.get('_action') === 'delete' &&
    navigation.formData?.get('id') === todo.id;

  // Optimistic UI: predict the completed state
  const optimisticCompleted = isTogglingThis ? !todo.completed : todo.completed;

  return (
    <li
      className={`todo-item ${optimisticCompleted ? 'completed' : ''} ${
        isDeletingThis ? 'optimistic' : ''
      }`}
    >
      <Form method="post" style={{ display: 'contents' }}>
        <input type="hidden" name="_action" value="toggle" />
        <input type="hidden" name="id" value={todo.id} />
        <button
          type="submit"
          className="todo-checkbox"
          disabled={isTogglingThis}
          aria-label={optimisticCompleted ? 'Mark as incomplete' : 'Mark as complete'}
          style={{
            background: 'transparent',
            border: '2px solid var(--color-border)',
            borderRadius: 'var(--radius-sm)',
            cursor: 'pointer',
            position: 'relative',
          }}
        >
          {optimisticCompleted && (
            <span
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                fontSize: '14px',
              }}
              aria-hidden="true"
            >
              ✓
            </span>
          )}
          <span className="sr-only">
            {optimisticCompleted ? 'Completed' : 'Not completed'}
          </span>
        </button>
      </Form>

      <div className="todo-content">
        <span className="todo-text">{todo.text}</span>
        <span className="todo-timestamp">
          <span aria-hidden="true">🕒</span>
          {new Date(todo.createdAt).toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          })}
        </span>
      </div>

      <div className="todo-actions">
        <Form method="post">
          <input type="hidden" name="_action" value="delete" />
          <input type="hidden" name="id" value={todo.id} />
          <button
            type="submit"
            className="btn btn-danger"
            disabled={isDeletingThis}
            aria-label={`Delete todo: ${todo.text}`}
          >
            {isDeletingThis ? 'Deleting...' : 'Delete'}
          </button>
        </Form>
      </div>
    </li>
  );
}
