import { useState, forwardRef, useImperativeHandle, useRef } from 'react';
import './TodoInput.css';

interface TodoInputProps {
  onAdd: (text: string) => void;
}

export interface TodoInputRef {
  focus: () => void;
}

const TodoInput = forwardRef<TodoInputRef, TodoInputProps>(({ onAdd }, ref) => {
  const [text, setText] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useImperativeHandle(ref, () => ({
    focus: () => {
      inputRef.current?.focus();
    },
  }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedText = text.trim();
    if (trimmedText) {
      onAdd(trimmedText);
      setText('');
    }
  };

  return (
    <form className="todo-input-form" onSubmit={handleSubmit}>
      <div className="input-wrapper">
        <svg
          className="input-icon"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="8" x2="12" y2="16"></line>
          <line x1="8" y1="12" x2="16" y2="12"></line>
        </svg>
        <input
          ref={inputRef}
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
          title="Add todo (Enter)"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </button>
      </div>
    </form>
  );
});

TodoInput.displayName = 'TodoInput';

export default TodoInput;
