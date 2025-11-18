import { component$, useSignal, $, useTask$ } from '@builder.io/qwik';
import type { PropFunction } from '@builder.io/qwik';
import type { Todo } from '../../types';

/**
 * TodoItem Component
 *
 * Demonstrates:
 * 1. component$ - Lazy-loadable component
 * 2. useSignal - Local reactive state
 * 3. useTask$ - Effect that runs on signal changes
 * 4. $ - Lazy event handlers
 * 5. PropFunction - Type-safe callbacks
 *
 * Key Qwik Concept: Fine-grained reactivity
 * Only this component re-renders when its props change,
 * not the entire tree. This is possible because of Qwik's
 * resumability and signal-based reactivity.
 */

interface TodoItemProps {
  /** The todo item to display */
  todo: Todo;

  /** Whether this todo is being edited */
  isEditing: boolean;

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
}

export const TodoItem = component$<TodoItemProps>(({
  todo,
  isEditing,
  onToggle$,
  onDelete$,
  onEditStart$,
  onEditSave$,
  onEditCancel$,
}) => {
  // Local state for edit input
  const editValue = useSignal(todo.text);
  const isComposing = useSignal(false);

  /**
   * useTask$ runs when tracked signals change
   *
   * This is similar to React's useEffect, but with key differences:
   * 1. Runs on the server during SSR
   * 2. Can be serialized and resumed on the client
   * 3. Automatically tracks dependencies (no dependency array needed)
   */
  useTask$(({ track }) => {
    // Track changes to todo.text
    track(() => todo.text);

    // Update editValue when todo.text changes
    editValue.value = todo.text;
  });

  /**
   * Handle toggle checkbox
   */
  const handleToggle$ = $(() => {
    onToggle$(todo.id);
  });

  /**
   * Handle delete button
   */
  const handleDelete$ = $(() => {
    onDelete$(todo.id);
  });

  /**
   * Handle double-click to edit
   */
  const handleDoubleClick$ = $(() => {
    if (!isEditing) {
      onEditStart$(todo.id);
    }
  });

  /**
   * Handle edit form submission
   */
  const handleEditSubmit$ = $((event: Event) => {
    event.preventDefault();

    const text = editValue.value.trim();

    if (text) {
      onEditSave$(todo.id, text);
    } else {
      // Delete todo if text is empty
      onDelete$(todo.id);
    }
  });

  /**
   * Handle edit input changes
   */
  const handleEditInput$ = $((event: Event) => {
    const target = event.target as HTMLInputElement;
    if (!isComposing.value) {
      editValue.value = target.value;
    }
  });

  /**
   * Handle composition start
   */
  const handleCompositionStart$ = $(() => {
    isComposing.value = true;
  });

  /**
   * Handle composition end
   */
  const handleCompositionEnd$ = $((event: Event) => {
    isComposing.value = false;
    const target = event.target as HTMLInputElement;
    editValue.value = target.value;
  });

  /**
   * Handle escape key to cancel edit
   */
  const handleKeyDown$ = $((event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      editValue.value = todo.text;
      onEditCancel$();
    }
  });

  return (
    <li
      class={{
        'todo-item': true,
        'completed': todo.completed,
        'editing': isEditing,
      }}
    >
      {isEditing ? (
        // Edit mode
        <form class="edit-form" preventdefault:submit onSubmit$={handleEditSubmit$}>
          <input
            type="text"
            class="edit-input"
            value={editValue.value}
            onInput$={handleEditInput$}
            onCompositionStart$={handleCompositionStart$}
            onCompositionEnd$={handleCompositionEnd$}
            onKeyDown$={handleKeyDown$}
            onBlur$={handleEditSubmit$}
            aria-label="Edit todo"
            autoFocus
          />
        </form>
      ) : (
        // View mode
        <div class="view">
          <div class="checkbox-wrapper">
            <input
              type="checkbox"
              class="toggle"
              checked={todo.completed}
              onChange$={handleToggle$}
              id={`todo-${todo.id}`}
              aria-label={`Mark "${todo.text}" as ${todo.completed ? 'incomplete' : 'complete'}`}
            />
            <label for={`todo-${todo.id}`} class="checkbox-label">
              <svg class="checkbox-icon" width="20" height="20" viewBox="0 0 20 20">
                <path
                  d="M4 10l4 4 8-8"
                  stroke="currentColor"
                  stroke-width="2"
                  fill="none"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </label>
          </div>

          <label
            class="todo-text"
            onDblClick$={handleDoubleClick$}
            title="Double-click to edit"
          >
            {todo.text}
          </label>

          <button
            class="delete-button"
            onClick$={handleDelete$}
            aria-label={`Delete "${todo.text}"`}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path
                d="M4 4l8 8M12 4l-8 8"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
              />
            </svg>
          </button>
        </div>
      )}
    </li>
  );
});
