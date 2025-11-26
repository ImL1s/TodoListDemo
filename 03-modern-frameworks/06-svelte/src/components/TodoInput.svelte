<script>
  import { createEventDispatcher } from 'svelte';

  // 創建事件調度器（類似於 Vue 的 $emit）
  const dispatch = createEventDispatcher();

  // 響應式變量（使用 let 聲明）
  let inputValue = '';

  // 處理表單提交
  function handleSubmit() {
    const trimmed = inputValue.trim();
    if (trimmed) {
      // 觸發自定義事件，向父組件傳遞數據
      dispatch('add', trimmed);
      inputValue = ''; // 清空輸入框
    }
  }

  // 處理鍵盤事件
  function handleKeydown(event) {
    if (event.key === 'Enter') {
      handleSubmit();
    }
  }
</script>

<div class="todo-input-container">
  <!-- Svelte 的雙向綁定：bind:value -->
  <!-- 類似於 Vue 的 v-model，但語法更明確 -->
  <input
    type="text"
    bind:value={inputValue}
    on:keydown={handleKeydown}
    placeholder="輸入待辦事項..."
    class="todo-input"
    autocomplete="off"
  />
  <button
    on:click={handleSubmit}
    class="add-button"
    disabled={!inputValue.trim()}
  >
    <span class="button-icon">+</span>
    <span class="button-text">添加</span>
  </button>
</div>

<style>
  .todo-input-container {
    display: flex;
    gap: 0.75rem;
    margin-bottom: 1.5rem;
  }

  .todo-input {
    flex: 1;
    padding: 1rem 1.25rem;
    font-size: 1rem;
    border: 2px solid #e0e0e0;
    border-radius: 12px;
    background: white;
    transition: all 0.3s;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  }

  .todo-input:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.2);
  }

  .todo-input::placeholder {
    color: #999;
  }

  .add-button {
    padding: 1rem 1.5rem;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border: none;
    border-radius: 12px;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    transition: all 0.3s;
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
  }

  .add-button:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(102, 126, 234, 0.4);
  }

  .add-button:active:not(:disabled) {
    transform: translateY(0);
  }

  .add-button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    box-shadow: none;
  }

  .button-icon {
    font-size: 1.5rem;
    line-height: 1;
  }

  .button-text {
    font-size: 1rem;
  }

  /* 響應式設計 */
  @media (max-width: 640px) {
    .todo-input-container {
      flex-direction: column;
    }

    .add-button {
      justify-content: center;
    }

    .button-text {
      display: none;
    }

    .button-icon {
      font-size: 2rem;
    }
  }
</style>
