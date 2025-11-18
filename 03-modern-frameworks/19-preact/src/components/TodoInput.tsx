import { useState } from 'preact/hooks';
import { addTodo } from '../signals/todoSignals';

/**
 * TodoInput Component
 *
 * Provides an input field and button for adding new todos.
 * Demonstrates:
 * - Local component state with useState hook
 * - Event handling in Preact
 * - Integration with global signals through actions
 * - Form submission handling
 */
export function TodoInput() {
  // Local state for the input field
  const [inputValue, setInputValue] = useState('');

  /**
   * Handle form submission
   */
  const handleSubmit = (e: Event) => {
    e.preventDefault();

    if (inputValue.trim()) {
      // Call the signal action to add the todo
      addTodo(inputValue);

      // Clear the input field
      setInputValue('');
    }
  };

  /**
   * Handle input change
   */
  const handleInputChange = (e: Event) => {
    const target = e.target as HTMLInputElement;
    setInputValue(target.value);
  };

  /**
   * Handle Enter key press
   */
  const handleKeyPress = (e: KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit(e);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="todo-input-container">
      <input
        type="text"
        className="todo-input"
        placeholder="What needs to be done?"
        value={inputValue}
        onInput={handleInputChange}
        onKeyPress={handleKeyPress}
        autoFocus
      />
      <button
        type="submit"
        className="btn btn-primary"
        disabled={!inputValue.trim()}
      >
        Add
      </button>
    </form>
  );
}
