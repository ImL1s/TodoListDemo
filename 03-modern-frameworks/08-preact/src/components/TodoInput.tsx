import { useState } from 'preact/hooks';
import type { TodoInputProps } from '../types';
import type { JSX } from 'preact';

/**
 * TodoInput 組件 - 負責添加新的待辦事項
 * 展示 Preact 的事件類型定義和 Props 類型
 * 與 React 版本完全兼容的 API
 */
const TodoInput = ({ onAddTodo }: TodoInputProps) => {
  // 使用 TypeScript 明確指定狀態類型
  const [inputValue, setInputValue] = useState<string>('');

  // 明確定義表單提交事件的類型
  const handleSubmit = (e: JSX.TargetedEvent<HTMLFormElement, Event>): void => {
    e.preventDefault();

    const trimmedValue = inputValue.trim();
    if (trimmedValue) {
      onAddTodo(trimmedValue);
      setInputValue('');
    }
  };

  // 明確定義輸入變化事件的類型
  const handleChange = (e: JSX.TargetedEvent<HTMLInputElement, Event>): void => {
    setInputValue(e.currentTarget.value);
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
