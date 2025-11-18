/**
 * TodoInput Component - 待辦事項輸入組件
 *
 * 展示 MobX 的使用方式：
 * - 使用 observer HOC 使組件響應式
 * - 直接調用 store 的 action 方法
 */

import { observer } from 'mobx-react-lite';
import { useState, FormEvent, KeyboardEvent } from 'react';
import { todoStore } from '../stores/TodoStore';

const TodoInput = observer(() => {
  const [text, setText] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (text.trim()) {
      todoStore.addTodo(text);
      setText('');
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      handleSubmit(e);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="todo-input-form">
      <input
        type="text"
        className="todo-input"
        placeholder="新增待辦事項..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
        autoFocus
      />
      <button type="submit" className="add-button" disabled={!text.trim()}>
        新增
      </button>
    </form>
  );
});

TodoInput.displayName = 'TodoInput';

export default TodoInput;
