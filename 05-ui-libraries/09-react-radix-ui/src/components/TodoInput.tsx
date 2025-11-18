import React, { useState, FormEvent } from 'react';
import { useTodos } from '../context/TodoContext';
import styles from '../styles/App.module.css';

/**
 * TodoInput component for adding new todos
 *
 * Features:
 * - Controlled input with local state
 * - Form submission handling
 * - Input validation (no empty todos)
 * - Auto-focus and clear on submit
 * - Accessible form labels
 */
export const TodoInput: React.FC = () => {
  const [inputValue, setInputValue] = useState('');
  const { addTodo } = useTodos();

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const trimmedValue = inputValue.trim();
    if (trimmedValue) {
      addTodo(trimmedValue);
      setInputValue('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.todoForm}>
      <div className={styles.inputWrapper}>
        <label htmlFor="todo-input" className={styles.visuallyHidden}>
          New todo
        </label>
        <input
          id="todo-input"
          type="text"
          className={styles.todoInput}
          placeholder="What needs to be done?"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          autoFocus
        />
        <button
          type="submit"
          className={styles.addButton}
          disabled={!inputValue.trim()}
          aria-label="Add todo"
        >
          Add
        </button>
      </div>
    </form>
  );
};
