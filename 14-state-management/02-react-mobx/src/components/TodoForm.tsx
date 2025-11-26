import { observer } from 'mobx-react-lite';
import { useState } from 'react';
import { todoStore } from '../stores/TodoStore';

/**
 * TodoForm - 新增 Todo 的表單組件
 *
 * 使用 observer HOC 將組件轉換為響應式組件
 * 當 store 中的 observable 數據改變時，組件會自動重新渲染
 */
const TodoForm = observer(() => {
  const [inputValue, setInputValue] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      // 調用 store 的 action
      todoStore.addTodo(inputValue);
      setInputValue('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="todo-form">
      <input
        type="text"
        className="todo-input"
        placeholder="接下來要做什麼？"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        autoFocus
      />
      <button type="submit" className="add-button">
        新增
      </button>
    </form>
  );
});

export default TodoForm;
