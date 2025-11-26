import { component$, useSignal, $ } from '@builder.io/qwik';
import type { PropFunction } from '@builder.io/qwik';

/**
 * TodoInput Component
 *
 * Demonstrates Qwik's key features:
 * 1. component$ - Defines a lazy-loadable component
 * 2. useSignal - Creates reactive state (similar to React's useState)
 * 3. $ - The optimizer marker for lazy-loading event handlers
 *
 * The $ suffix tells Qwik's optimizer to:
 * - Extract this code into a separate chunk
 * - Load it only when needed (lazy execution)
 * - Enable resumability without hydration
 */

interface TodoInputProps {
  /** Callback function when a new todo is added */
  onAdd$: PropFunction<(text: string) => void>;
}

export const TodoInput = component$<TodoInputProps>(({ onAdd$ }) => {
  // useSignal creates a reactive signal
  // Changes to inputValue.value will trigger re-renders
  const inputValue = useSignal('');
  const isComposing = useSignal(false);

  /**
   * Handle form submission
   *
   * The $ suffix marks this as a QRL (Qwik Resource Locator)
   * This function will be:
   * - Extracted into a separate chunk
   * - Loaded only when the form is submitted
   * - Serialized and resumed on the client without hydration
   */
  const handleSubmit$ = $((event: Event) => {
    event.preventDefault();

    const text = inputValue.value.trim();

    if (text) {
      // Call the parent's onAdd$ callback
      onAdd$(text);

      // Reset the input
      inputValue.value = '';
    }
  });

  /**
   * Handle input changes
   *
   * Note: We check isComposing to properly handle IME input
   * (Chinese, Japanese, Korean, etc.)
   */
  const handleInput$ = $((event: Event) => {
    const target = event.target as HTMLInputElement;
    if (!isComposing.value) {
      inputValue.value = target.value;
    }
  });

  /**
   * Handle composition start (IME input)
   */
  const handleCompositionStart$ = $(() => {
    isComposing.value = true;
  });

  /**
   * Handle composition end (IME input)
   */
  const handleCompositionEnd$ = $((event: Event) => {
    isComposing.value = false;
    const target = event.target as HTMLInputElement;
    inputValue.value = target.value;
  });

  return (
    <form class="todo-input-form" preventdefault:submit onSubmit$={handleSubmit$}>
      <div class="input-wrapper">
        <input
          type="text"
          class="todo-input"
          placeholder="What needs to be done?"
          value={inputValue.value}
          onInput$={handleInput$}
          onCompositionStart$={handleCompositionStart$}
          onCompositionEnd$={handleCompositionEnd$}
          aria-label="New todo input"
          autoFocus
        />
        <button
          type="submit"
          class="add-button"
          disabled={!inputValue.value.trim()}
          aria-label="Add todo"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M10 4V16M4 10H16" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
          Add
        </button>
      </div>
    </form>
  );
});

/**
 * Component Styles
 *
 * Note: Qwik supports scoped styles, inline styles, or CSS modules.
 * Here we're using inline styles for simplicity, but in production
 * you might want to use CSS modules or a styling solution.
 */
