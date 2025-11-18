import React, { useState, FormEvent, ChangeEvent } from 'react';
import type { TodoInputProps } from '../types';

/**
 * TodoInput Component
 *
 * Input field for adding new todos with form validation
 */
export const TodoInput: React.FC<TodoInputProps> = ({ onAdd }) => {
  const [inputValue, setInputValue] = useState('');

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (inputValue.trim()) {
      onAdd(inputValue);
      setInputValue('');
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  return (
    <form onSubmit={handleSubmit} className="todo-input-form">
      <input
        type="text"
        value={inputValue}
        onChange={handleChange}
        placeholder="What needs to be done?"
        className="todo-input"
        autoFocus
        aria-label="New todo input"
      />
      <button
        type="submit"
        className="add-button"
        disabled={!inputValue.trim()}
        aria-label="Add todo"
      >
        Add
      </button>

      <style>{`
        .todo-input-form {
          display: flex;
          gap: 12px;
          margin-bottom: 24px;
        }

        .todo-input {
          flex: 1;
          padding: 14px 18px;
          font-size: 16px;
          border: 2px solid #e5e7eb;
          border-radius: 12px;
          transition: all 0.2s;
          font-family: inherit;
        }

        .todo-input:focus {
          outline: none;
          border-color: #4f46e5;
          box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
        }

        .todo-input::placeholder {
          color: #9ca3af;
        }

        .add-button {
          padding: 14px 28px;
          font-size: 16px;
          font-weight: 600;
          color: white;
          background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
          border: none;
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.2s;
          white-space: nowrap;
        }

        .add-button:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 16px rgba(79, 70, 229, 0.3);
        }

        .add-button:active:not(:disabled) {
          transform: translateY(0);
        }

        .add-button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        @media (max-width: 640px) {
          .todo-input-form {
            flex-direction: column;
            gap: 10px;
          }

          .add-button {
            width: 100%;
          }
        }
      `}</style>
    </form>
  );
};
