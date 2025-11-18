import React, { useState, FormEvent, ChangeEvent } from 'react';
import { useTodoStore } from '../store/useTodoStore';

/**
 * TodoInput 組件
 * Zustand 優勢：直接從 store 獲取方法，無需 props drilling
 */
const TodoInput: React.FC = () => {
  const [inputValue, setInputValue] = useState<string>('');

  // Zustand：直接訂閱需要的方法
  // 這種選擇性訂閱可以避免不必要的重渲染
  const addTodo = useTodoStore((state) => state.addTodo);

  const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();

    const trimmedValue = inputValue.trim();
    if (trimmedValue) {
      addTodo(trimmedValue);
      setInputValue('');
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setInputValue(e.target.value);
  };

  return (
    <form onSubmit={handleSubmit} className="todo-input-form">
      <input
        type="text"
        value={inputValue}
        onChange={handleChange}
        placeholder="輸入新的待辦事項..."
        className="todo-input"
        autoFocus
      />
      <button
        type="submit"
        className="add-button"
        disabled={!inputValue.trim()}
      >
        添加
      </button>
    </form>
  );
};

export default TodoInput;
