import { useState, FormEvent } from 'react';
import { TodoInputProps } from '../types';

/**
 * TodoInput Component
 * Handles user input for creating new todos
 * Communicates with parent component via onAdd callback
 */
function TodoInput({ onAdd }: TodoInputProps) {
  const [text, setText] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    const trimmedText = text.trim();
    if (trimmedText) {
      onAdd(trimmedText);
      setText('');
    }
  };

  return (
    <div className="todo-input-container">
      <form onSubmit={handleSubmit} className="todo-input-form">
        <input
          type="text"
          className="todo-input"
          placeholder="What needs to be done?"
          value={text}
          onChange={(e) => setText(e.target.value)}
          autoFocus
        />
        <button
          type="submit"
          className="add-button"
          disabled={!text.trim()}
        >
          Add Todo
        </button>
      </form>
    </div>
  );
}

export default TodoInput;
