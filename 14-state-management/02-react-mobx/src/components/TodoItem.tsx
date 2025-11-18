import { observer } from 'mobx-react-lite';
import { useState, useEffect, useRef } from 'react';
import { todoStore } from '../stores/TodoStore';
import type { Todo } from '../types/todo';

interface TodoItemProps {
  todo: Todo;
}

/**
 * TodoItem - 單個 Todo 項目組件
 *
 * observer: MobX 的高階組件，使組件成為響應式
 * 當 todo 對象的任何 observable 屬性改變時，組件會自動重新渲染
 */
const TodoItem = observer(({ todo }: TodoItemProps) => {
  const [editText, setEditText] = useState(todo.text);
  const editInputRef = useRef<HTMLInputElement>(null);
  const isEditing = todoStore.editingId === todo.id;

  // 當進入編輯模式時，自動聚焦輸入框
  useEffect(() => {
    if (isEditing && editInputRef.current) {
      editInputRef.current.focus();
      editInputRef.current.select();
    }
  }, [isEditing]);

  const handleEdit = () => {
    todoStore.setEditingId(todo.id);
    setEditText(todo.text);
  };

  const handleSave = () => {
    if (editText.trim()) {
      todoStore.updateTodo(todo.id, editText);
    } else {
      todoStore.deleteTodo(todo.id);
    }
  };

  const handleCancel = () => {
    todoStore.setEditingId(null);
    setEditText(todo.text);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  if (isEditing) {
    return (
      <li className="todo-item editing">
        <input
          ref={editInputRef}
          type="text"
          className="edit-input"
          value={editText}
          onChange={(e) => setEditText(e.target.value)}
          onBlur={handleSave}
          onKeyDown={handleKeyDown}
        />
      </li>
    );
  }

  return (
    <li className={`todo-item ${todo.completed ? 'completed' : ''}`}>
      <div className="todo-item-content">
        <input
          type="checkbox"
          className="todo-checkbox"
          checked={todo.completed}
          onChange={() => todoStore.toggleTodo(todo.id)}
        />
        <label
          className="todo-text"
          onDoubleClick={handleEdit}
          title="雙擊以編輯"
        >
          {todo.text}
        </label>
      </div>
      <button
        className="delete-button"
        onClick={() => todoStore.deleteTodo(todo.id)}
        aria-label="刪除"
      >
        ×
      </button>
    </li>
  );
});

export default TodoItem;
