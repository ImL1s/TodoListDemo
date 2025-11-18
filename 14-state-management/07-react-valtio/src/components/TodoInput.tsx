/**
 * TodoInput Component
 *
 * Demonstrates:
 * - Direct mutation via todoActions
 * - No need for dispatch or complex action creators
 */

import React, { useState, FormEvent, ChangeEvent } from 'react';
import { todoActions } from '../store/todoStore';

export const TodoInput: React.FC = () => {
  const [input, setInput] = useState('');

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (input.trim()) {
      // Direct mutation - just call the action function
      todoActions.addTodo(input);
      setInput('');
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  return (
    <form onSubmit={handleSubmit} className="todo-input-form">
      <input
        type="text"
        className="todo-input"
        placeholder="What needs to be done?"
        value={input}
        onChange={handleChange}
        autoFocus
      />
      <button type="submit" className="add-button">
        Add Todo
      </button>
    </form>
  );
};
