import { component$, $ } from '@builder.io/qwik';
import type { PropFunction } from '@builder.io/qwik';
import type { Todo } from '../../types';
import { TodoItem } from '../todo-item/todo-item';

/**
 * TodoList Component
 *
 * Demonstrates:
 * 1. Rendering lists in Qwik
 * 2. Passing callbacks to child components
 * 3. Conditional rendering
 * 4. Component composition
 *
 * Key Qwik Concept: Lazy component loading
 * Each TodoItem component is loaded independently.
 * If you have 100 todos and scroll to view only 10,
 * Qwik will only load those 10 TodoItem components.
 */

interface TodoListProps {
  /** Array of todos to display */
  todos: Todo[];

  /** ID of the todo being edited */
  editingId: string | null;

  /** Callback when todo is toggled */
  onToggle$: PropFunction<(id: string) => void>;

  /** Callback when todo is deleted */
  onDelete$: PropFunction<(id: string) => void>;

  /** Callback when edit mode starts */
  onEditStart$: PropFunction<(id: string) => void>;

  /** Callback when todo is saved */
  onEditSave$: PropFunction<(id: string, text: string) => void>;

  /** Callback when edit is cancelled */
  onEditCancel$: PropFunction<() => void>;

  /** Callback to toggle all todos */
  onToggleAll$: PropFunction<() => void>;

  /** Callback to clear completed todos */
  onClearCompleted$: PropFunction<() => void>;
}

export const TodoList = component$<TodoListProps>(({
  todos,
  editingId,
  onToggle$,
  onDelete$,
  onEditStart$,
  onEditSave$,
  onEditCancel$,
  onToggleAll$,
  onClearCompleted$,
}) => {
  const hasCompletedTodos = todos.some(todo => todo.completed);
  const allCompleted = todos.length > 0 && todos.every(todo => todo.completed);

  /**
   * Handle toggle all checkbox
   */
  const handleToggleAll$ = $(() => {
    onToggleAll$();
  });

  /**
   * Handle clear completed button
   */
  const handleClearCompleted$ = $(() => {
    onClearCompleted$();
  });

  if (todos.length === 0) {
    return (
      <div class="empty-state">
        <svg
          width="80"
          height="80"
          viewBox="0 0 80 80"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="40" cy="40" r="38" stroke="#e0e0e0" stroke-width="2" />
          <path
            d="M30 40l8 8 12-16"
            stroke="#e0e0e0"
            stroke-width="3"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
        <p class="empty-text">No todos yet</p>
        <p class="empty-subtext">Add a task to get started</p>
      </div>
    );
  }

  return (
    <div class="todo-list-container">
      <div class="list-header">
        <div class="toggle-all-wrapper">
          <input
            type="checkbox"
            class="toggle-all"
            checked={allCompleted}
            onChange$={handleToggleAll$}
            id="toggle-all"
            aria-label="Toggle all todos"
          />
          <label for="toggle-all" class="toggle-all-label">
            <svg
              class="toggle-all-icon"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
            >
              <path
                d="M6 12l4 4 8-8"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </label>
        </div>
        <span class="list-count">
          {todos.length} {todos.length === 1 ? 'item' : 'items'}
        </span>
      </div>

      <ul class="todo-list">
        {todos.map((todo) => (
          <TodoItem
            key={todo.id}
            todo={todo}
            isEditing={editingId === todo.id}
            onToggle$={onToggle$}
            onDelete$={onDelete$}
            onEditStart$={onEditStart$}
            onEditSave$={onEditSave$}
            onEditCancel$={onEditCancel$}
          />
        ))}
      </ul>

      {hasCompletedTodos && (
        <div class="list-footer">
          <button
            class="clear-completed"
            onClick$={handleClearCompleted$}
            aria-label="Clear completed todos"
          >
            Clear completed
          </button>
        </div>
      )}
    </div>
  );
});
