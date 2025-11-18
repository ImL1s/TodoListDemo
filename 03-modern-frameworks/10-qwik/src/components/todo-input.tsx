import { component$, type QRL, type Signal } from '@builder.io/qwik';

interface TodoInputProps {
  value: Signal<string>;
  onAdd$: QRL<() => void>;
  onToggleAll$: QRL<() => void>;
  hasItems: boolean;
  allCompleted: boolean;
}

export const TodoInput = component$<TodoInputProps>(
  ({ value, onAdd$, onToggleAll$, hasItems, allCompleted }) => {
    return (
      <div class="flex gap-3">
        {/* Toggle All Button */}
        {hasItems && (
          <button
            class={`flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center transition-all ${
              allCompleted
                ? 'bg-white text-purple-600'
                : 'bg-purple-500 text-white hover:bg-purple-400'
            }`}
            onClick$={onToggleAll$}
            title="Toggle all todos"
            aria-label="Toggle all todos"
          >
            <svg
              class="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </button>
        )}

        {/* Input Field */}
        <div class="flex-1 relative">
          <input
            type="text"
            class="w-full px-6 py-3 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white shadow-lg"
            placeholder="What needs to be done?"
            value={value.value}
            onInput$={(e) => {
              value.value = (e.target as HTMLInputElement).value;
            }}
            onKeyDown$={(e) => {
              if (e.key === 'Enter') {
                onAdd$();
              }
            }}
          />
        </div>

        {/* Add Button */}
        <button
          class="flex-shrink-0 px-6 py-3 bg-white text-purple-600 font-semibold rounded-xl hover:bg-purple-50 transition-all shadow-lg"
          onClick$={onAdd$}
        >
          Add
        </button>
      </div>
    );
  }
);
