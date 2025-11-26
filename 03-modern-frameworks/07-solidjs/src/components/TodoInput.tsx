import { createSignal } from 'solid-js';
import type { TodoInputProps } from '../types';

/**
 * TodoInput 組件 - 負責添加新的待辦事項
 * 展示 SolidJS 的表單處理和事件系統
 *
 * 與 React 的關鍵差異：
 * 1. 使用 createSignal 而不是 useState
 * 2. 事件處理器類型更簡單（不需要 React 的 FormEvent 類型）
 * 3. 組件函數只運行一次，不會重新渲染
 * 4. 使用 onInput 或 onChange 都可以，行為略有不同
 */
const TodoInput = (props: TodoInputProps) => {
  // 創建響應式 Signal
  const [inputValue, setInputValue] = createSignal<string>('');

  // 處理表單提交
  const handleSubmit = (e: Event): void => {
    e.preventDefault();

    const trimmedValue = inputValue().trim();
    if (trimmedValue) {
      props.onAddTodo(trimmedValue);
      setInputValue('');
    }
  };

  // 處理輸入變化
  // 在 SolidJS 中，可以直接從事件目標獲取值
  const handleInput = (e: InputEvent): void => {
    const target = e.target as HTMLInputElement;
    setInputValue(target.value);
  };

  return (
    <form onSubmit={handleSubmit} class="todo-input-form">
      <input
        type="text"
        value={inputValue()}
        onInput={handleInput}
        placeholder="輸入新的待辦事項..."
        class="todo-input"
        autofocus
      />
      <button
        type="submit"
        class="add-button"
        disabled={!inputValue().trim()}
      >
        添加
      </button>
    </form>
  );
};

export default TodoInput;
