import { useState, FormEvent } from 'react';
import { useAppDispatch } from '../../app/hooks';
import { addTodo } from './todosSlice';

/**
 * Todo 輸入組件
 * 用於新增新的 todo 項目
 */
export function TodoInput() {
  const [text, setText] = useState('');
  const dispatch = useAppDispatch();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (text.trim()) {
      // 使用同步 action
      dispatch(addTodo(text.trim()));
      // 或使用非同步 action（示範用）
      // dispatch(addTodoAsync(text.trim()));
      setText('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="todo-input">
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="新增待辦事項..."
        className="todo-input-field"
        autoFocus
      />
      <button type="submit" className="todo-add-button">
        新增
      </button>
    </form>
  );
}
