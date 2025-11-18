/**
 * TodoInput Component
 * Demonstrates simple action dispatch without props drilling
 */

import { useState, FormEvent, KeyboardEvent } from 'react';
import { addTodo } from '../stores/todoStore';

export function TodoInput() {
  const [text, setText] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (text.trim()) {
      addTodo(text);
      setText('');
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSubmit(e);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="todo-input-form">
      <input
        type="text"
        className="todo-input"
        placeholder="What needs to be done?"
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
        autoFocus
      />
    </form>
  );
}
