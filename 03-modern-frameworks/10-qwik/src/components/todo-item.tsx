import { component$, useSignal, type QRL } from '@builder.io/qwik';
import type { Todo } from '../routes';

interface TodoItemProps {
  todo: Todo;
  onToggle$: QRL<(id: number) => void>;
  onDelete$: QRL<(id: number) => void>;
  onEdit$: QRL<(id: number, text: string) => void>;
}

export const TodoItem = component$<TodoItemProps>(
  ({ todo, onToggle$, onDelete$, onEdit$ }) => {
    const isEditing = useSignal(false);
    const editValue = useSignal(todo.text);

    return (
      <div class="flex items-center gap-3 p-4 hover:bg-gray-50 transition-colors group">
        {/* Checkbox */}
        <button
          class={`flex-shrink-0 w-6 h-6 rounded-md border-2 flex items-center justify-center transition-all ${
            todo.completed
              ? 'bg-purple-600 border-purple-600'
              : 'border-gray-300 hover:border-purple-400'
          }`}
          onClick$={() => onToggle$(todo.id)}
          aria-label={todo.completed ? 'Mark as incomplete' : 'Mark as complete'}
        >
          {todo.completed && (
            <svg
              class="w-4 h-4 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="3"
                d="M5 13l4 4L19 7"
              />
            </svg>
          )}
        </button>

        {/* Todo Text / Edit Input */}
        <div class="flex-1 min-w-0">
          {isEditing.value ? (
            <input
              type="text"
              class="w-full px-3 py-1 border-2 border-purple-400 rounded-lg focus:outline-none focus:border-purple-600"
              value={editValue.value}
              onInput$={(e) => {
                editValue.value = (e.target as HTMLInputElement).value;
              }}
              onKeyDown$={(e) => {
                if (e.key === 'Enter') {
                  const trimmedText = editValue.value.trim();
                  if (trimmedText) {
                    onEdit$(todo.id, trimmedText);
                  }
                  isEditing.value = false;
                } else if (e.key === 'Escape') {
                  editValue.value = todo.text;
                  isEditing.value = false;
                }
              }}
              onBlur$={() => {
                const trimmedText = editValue.value.trim();
                if (trimmedText && trimmedText !== todo.text) {
                  onEdit$(todo.id, trimmedText);
                } else {
                  editValue.value = todo.text;
                }
                isEditing.value = false;
              }}
              autoFocus
            />
          ) : (
            <p
              class={`text-gray-800 truncate ${
                todo.completed ? 'line-through text-gray-400' : ''
              }`}
              onDblClick$={() => {
                if (!todo.completed) {
                  isEditing.value = true;
                  editValue.value = todo.text;
                }
              }}
            >
              {todo.text}
            </p>
          )}
        </div>

        {/* Action Buttons */}
        <div class="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          {!isEditing.value && !todo.completed && (
            <button
              class="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              onClick$={() => {
                isEditing.value = true;
                editValue.value = todo.text;
              }}
              aria-label="Edit todo"
            >
              <svg
                class="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
            </button>
          )}

          <button
            class="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            onClick$={() => onDelete$(todo.id)}
            aria-label="Delete todo"
          >
            <svg
              class="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </button>
        </div>
      </div>
    );
  }
);
