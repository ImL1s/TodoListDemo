<script>
  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher();

  // Props
  export let todo;

  // 組件本地狀態
  let isEditing = false;
  let editValue = todo.text;

  // 切換完成狀態
  function handleToggle() {
    dispatch('toggle', todo.id);
  }

  // 刪除待辦
  function handleDelete() {
    if (confirm('確定要刪除這個待辦事項嗎？')) {
      dispatch('delete', todo.id);
    }
  }

  // 進入編輯模式
  function startEdit() {
    isEditing = true;
    editValue = todo.text;
    // 使用 tick() 等待 DOM 更新後聚焦輸入框
    setTimeout(() => {
      const input = document.querySelector('.edit-input');
      if (input) input.focus();
    }, 0);
  }

  // 保存編輯
  function saveEdit() {
    const trimmed = editValue.trim();
    if (trimmed && trimmed !== todo.text) {
      dispatch('edit', { id: todo.id, text: trimmed });
    }
    isEditing = false;
  }

  // 取消編輯
  function cancelEdit() {
    isEditing = false;
    editValue = todo.text;
  }

  // 處理鍵盤事件
  function handleKeydown(event) {
    if (event.key === 'Enter') {
      saveEdit();
    } else if (event.key === 'Escape') {
      cancelEdit();
    }
  }

  // 格式化日期
  function formatDate(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return '剛剛';
    if (minutes < 60) return `${minutes} 分鐘前`;
    if (hours < 24) return `${hours} 小時前`;
    if (days < 7) return `${days} 天前`;
    return date.toLocaleDateString('zh-CN');
  }
</script>

<div class="todo-item" class:completed={todo.completed}>
  <div class="todo-content">
    <!-- 複選框 -->
    <label class="checkbox-container">
      <input
        type="checkbox"
        checked={todo.completed}
        on:change={handleToggle}
        class="checkbox"
      />
      <span class="checkmark"></span>
    </label>

    <!-- 待辦文本或編輯輸入框 -->
    {#if isEditing}
      <input
        type="text"
        bind:value={editValue}
        on:keydown={handleKeydown}
        on:blur={saveEdit}
        class="edit-input"
      />
    {:else}
      <div class="todo-text-container">
        <span class="todo-text" on:dblclick={startEdit}>
          {todo.text}
        </span>
        <span class="todo-date">{formatDate(todo.createdAt)}</span>
      </div>
    {/if}
  </div>

  <!-- 操作按鈕 -->
  {#if !isEditing}
    <div class="todo-actions">
      <button
        on:click={startEdit}
        class="action-btn edit-btn"
        title="編輯"
      >
        ✏️
      </button>
      <button
        on:click={handleDelete}
        class="action-btn delete-btn"
        title="刪除"
      >
        🗑️
      </button>
    </div>
  {/if}
</div>

<style>
  .todo-item {
    background: white;
    border-radius: 12px;
    padding: 1rem 1.25rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    transition: all 0.3s;
  }

  .todo-item:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    transform: translateX(4px);
  }

  .todo-item.completed {
    background: #f8f9fa;
    opacity: 0.8;
  }

  .todo-content {
    flex: 1;
    display: flex;
    align-items: center;
    gap: 1rem;
    min-width: 0;
  }

  /* 自定義複選框 */
  .checkbox-container {
    position: relative;
    cursor: pointer;
    user-select: none;
    flex-shrink: 0;
  }

  .checkbox {
    position: absolute;
    opacity: 0;
    cursor: pointer;
    width: 0;
    height: 0;
  }

  .checkmark {
    display: block;
    width: 24px;
    height: 24px;
    border: 2px solid #ddd;
    border-radius: 6px;
    background: white;
    transition: all 0.3s;
  }

  .checkbox:checked ~ .checkmark {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-color: #667eea;
  }

  .checkbox:checked ~ .checkmark::after {
    content: '✓';
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    color: white;
    font-size: 16px;
    font-weight: bold;
  }

  /* 待辦文本 */
  .todo-text-container {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  .todo-text {
    font-size: 1rem;
    color: #333;
    word-break: break-word;
    cursor: pointer;
    transition: color 0.3s;
  }

  .todo-item.completed .todo-text {
    text-decoration: line-through;
    color: #999;
  }

  .todo-text:hover {
    color: #667eea;
  }

  .todo-date {
    font-size: 0.75rem;
    color: #999;
  }

  /* 編輯輸入框 */
  .edit-input {
    flex: 1;
    padding: 0.5rem;
    font-size: 1rem;
    border: 2px solid #667eea;
    border-radius: 6px;
    background: #f8f9fa;
  }

  .edit-input:focus {
    outline: none;
    background: white;
  }

  /* 操作按鈕 */
  .todo-actions {
    display: flex;
    gap: 0.5rem;
    flex-shrink: 0;
  }

  .action-btn {
    width: 36px;
    height: 36px;
    border: none;
    background: transparent;
    border-radius: 8px;
    cursor: pointer;
    font-size: 1.1rem;
    transition: all 0.3s;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .action-btn:hover {
    background: #f0f0f0;
    transform: scale(1.1);
  }

  .edit-btn:hover {
    background: #e3f2fd;
  }

  .delete-btn:hover {
    background: #ffebee;
  }

  /* 響應式設計 */
  @media (max-width: 640px) {
    .todo-item {
      padding: 0.875rem 1rem;
    }

    .todo-text {
      font-size: 0.95rem;
    }

    .action-btn {
      width: 32px;
      height: 32px;
      font-size: 1rem;
    }
  }
</style>
