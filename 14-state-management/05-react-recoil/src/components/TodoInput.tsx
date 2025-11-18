import { useState, FormEvent, ChangeEvent } from 'react';
import { useSetRecoilState } from 'recoil';
import { todosState } from '../state/atoms';
import { Todo } from '../types';

/**
 * TodoInput Component
 * Handles creation of new todos with text, priority, and category
 */
export function TodoInput() {
  const [text, setText] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [category, setCategory] = useState('');
  const setTodos = useSetRecoilState(todosState);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    const trimmedText = text.trim();
    if (!trimmedText) return;

    const newTodo: Todo = {
      id: crypto.randomUUID(),
      text: trimmedText,
      completed: false,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      priority,
      category: category.trim() || undefined,
    };

    setTodos((prevTodos) => [...prevTodos, newTodo]);

    // Reset form
    setText('');
    setPriority('medium');
    setCategory('');
  };

  const handleTextChange = (e: ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value);
  };

  const handlePriorityChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setPriority(e.target.value as 'low' | 'medium' | 'high');
  };

  const handleCategoryChange = (e: ChangeEvent<HTMLInputElement>) => {
    setCategory(e.target.value);
  };

  return (
    <form onSubmit={handleSubmit} className="todo-input">
      <div className="input-group">
        <input
          type="text"
          value={text}
          onChange={handleTextChange}
          placeholder="What needs to be done?"
          className="todo-text-input"
          autoFocus
        />

        <select
          value={priority}
          onChange={handlePriorityChange}
          className="priority-select"
        >
          <option value="low">Low Priority</option>
          <option value="medium">Medium Priority</option>
          <option value="high">High Priority</option>
        </select>

        <input
          type="text"
          value={category}
          onChange={handleCategoryChange}
          placeholder="Category (optional)"
          className="category-input"
        />

        <button type="submit" className="add-button">
          Add Todo
        </button>
      </div>
    </form>
  );
}
