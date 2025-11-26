import { createSignal, Show } from 'solid-js';
import type { TodoItemProps } from '../types';

/**
 * TodoItem 組件 - 單個待辦事項的展示和編輯
 * 展示 SolidJS 的本地狀態管理和條件渲染
 *
 * 與 React 的關鍵差異：
 * 1. 使用 createSignal 管理本地狀態
 * 2. 使用 <Show> 進行條件渲染（比三元運算符更優化）
 * 3. 事件處理更簡單，不需要複雜的類型定義
 * 4. 組件不會重新執行，只有 Signal 變化時更新 DOM
 */
const TodoItem = (props: TodoItemProps) => {
  const [isEditing, setIsEditing] = createSignal<boolean>(false);
  const [editText, setEditText] = createSignal<string>(props.todo.text);

  // 處理保存編輯
  const handleSave = (): void => {
    const trimmedText = editText().trim();
    if (trimmedText && trimmedText !== props.todo.text) {
      props.onEdit(props.todo.id, trimmedText);
    } else if (!trimmedText) {
      setEditText(props.todo.text);
    }
    setIsEditing(false);
  };

  // 處理取消編輯
  const handleCancel = (): void => {
    setEditText(props.todo.text);
    setIsEditing(false);
  };

  // 鍵盤事件處理
  const handleKeyDown = (e: KeyboardEvent): void => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  // 輸入變化處理
  const handleInput = (e: InputEvent): void => {
    const target = e.target as HTMLInputElement;
    setEditText(target.value);
  };

  // 格式化日期
  const formatDate = (timestamp: number): string => {
    return new Date(timestamp).toLocaleString('zh-TW', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <li class={`todo-item ${props.todo.completed ? 'completed' : ''}`}>
      <div class="todo-item-content">
        <input
          type="checkbox"
          checked={props.todo.completed}
          onChange={() => props.onToggle(props.todo.id)}
          class="todo-checkbox"
          disabled={isEditing()}
        />

        {/*
          SolidJS 的 <Show> 組件：
          - 提供優化的條件渲染
          - 只有在條件變化時才更新 DOM
          - 比三元運算符 ? : 更高效
        */}
        <Show
          when={isEditing()}
          fallback={
            <div class="todo-text-container">
              <span class="todo-text">{props.todo.text}</span>
              <span class="todo-date">
                {formatDate(props.todo.createdAt)}
                <Show when={props.todo.completed && props.todo.completedAt}>
                  {' • 完成於 ' + formatDate(props.todo.completedAt!)}
                </Show>
              </span>
            </div>
          }
        >
          <input
            type="text"
            value={editText()}
            onInput={handleInput}
            onKeyDown={handleKeyDown}
            onBlur={handleSave}
            class="todo-edit-input"
            autofocus
          />
        </Show>
      </div>

      <div class="todo-actions">
        <Show
          when={!isEditing()}
          fallback={
            <>
              <button
                onClick={handleSave}
                class="save-button"
                title="保存"
              >
                ✓
              </button>
              <button
                onClick={handleCancel}
                class="cancel-button"
                title="取消"
              >
                ✕
              </button>
            </>
          }
        >
          <button
            onClick={() => setIsEditing(true)}
            class="edit-button"
            disabled={props.todo.completed}
            title="編輯"
          >
            ✏️
          </button>
          <button
            onClick={() => props.onDelete(props.todo.id)}
            class="delete-button"
            title="刪除"
          >
            🗑️
          </button>
        </Show>
      </div>
    </li>
  );
};

export default TodoItem;
