import { useState } from 'react';

// React component for Astro
// This will only load JS when hydrated with client:* directive
export default function TodoInput() {
  const [text, setText] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;

    // Get existing todos from localStorage
    const todos = JSON.parse(localStorage.getItem('astro-todos') || '[]');

    // Create new todo
    const newTodo = {
      id: Date.now().toString(),
      text: text.trim(),
      completed: false,
      createdAt: new Date().toISOString(),
    };

    // Save to localStorage
    localStorage.setItem('astro-todos', JSON.stringify([...todos, newTodo]));

    // Clear input
    setText('');

    // Dispatch custom event to notify TodoList
    window.dispatchEvent(new CustomEvent('todosUpdated'));
  };

  return (
    <form onSubmit={handleSubmit} className="todo-input-form">
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="輸入新的待辦事項..."
        className="todo-input"
      />
      <button
        type="submit"
        className="btn btn-primary"
        disabled={!text.trim()}
      >
        新增
      </button>
    </form>
  );
}
