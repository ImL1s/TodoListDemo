import React, { useState, FormEvent, ChangeEvent } from 'react';
import type { TodoInputProps } from '../types';

/**
 * TodoInput 組件 - 負責添加新的待辦事項
 * 展示 TypeScript 的事件類型定義和 Props 類型
 */
const TodoInput: React.FC<TodoInputProps> = ({ onAddTodo }) => {
  // 使用 TypeScript 明確指定狀態類型
  const [inputValue, setInputValue] = useState<string>('');

  // 明確定義表單提交事件的類型
  const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();

    const trimmedValue = inputValue.trim();
    if (trimmedValue) {
      onAddTodo(trimmedValue);
      setInputValue('');
    }
  };

  // 明確定義輸入變化事件的類型
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
