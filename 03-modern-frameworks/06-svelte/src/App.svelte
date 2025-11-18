<script>
  import { onMount } from 'svelte';
  import TodoInput from './components/TodoInput.svelte';
  import TodoList from './components/TodoList.svelte';

  // 響應式狀態聲明
  let todos = [];
  let filter = 'all'; // all, active, completed

  // LocalStorage 鍵名
  const STORAGE_KEY = 'svelte-todos';

  // 從 LocalStorage 載入數據
  onMount(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        todos = JSON.parse(stored);
      } catch (e) {
        console.error('載入數據失敗:', e);
      }
    }
  });

  // 響應式聲明：當 todos 改變時自動保存到 LocalStorage
  // $: 是 Svelte 的反應式語法，類似於 Vue 的 watch 或 React 的 useEffect
  $: {
    if (todos.length >= 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
    }
  }

  // 響應式計算：過濾後的待辦事項
  $: filteredTodos = todos.filter(todo => {
    if (filter === 'active') return !todo.completed;
    if (filter === 'completed') return todo.completed;
    return true;
  });

  // 響應式計算：統計數據
  $: activeCount = todos.filter(t => !t.completed).length;
  $: completedCount = todos.filter(t => t.completed).length;

  // 添加待辦事項
  function addTodo(event) {
    const text = event.detail;
    const newTodo = {
      id: Date.now(),
      text,
      completed: false,
      createdAt: new Date().toISOString()
    };
    todos = [...todos, newTodo]; // Svelte 需要重新賦值來觸發更新
  }

  // 切換完成狀態
  function toggleTodo(event) {
    const id = event.detail;
    todos = todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    );
  }

  // 刪除待辦事項
  function deleteTodo(event) {
    const id = event.detail;
    todos = todos.filter(todo => todo.id !== id);
  }

  // 編輯待辦事項
  function editTodo(event) {
    const { id, text } = event.detail;
    todos = todos.map(todo =>
      todo.id === id ? { ...todo, text } : todo
    );
  }

  // 清除已完成
  function clearCompleted() {
    todos = todos.filter(todo => !todo.completed);
  }

  // 全部標記為完成
  function toggleAll() {
    const allCompleted = todos.every(todo => todo.completed);
    todos = todos.map(todo => ({ ...todo, completed: !allCompleted }));
  }
</script>

<main class="app">
  <div class="container">
    <header class="header">
      <h1>📝 Svelte Todo List</h1>
      <p class="subtitle">編譯時框架 • 極致性能 • 簡潔語法</p>
    </header>

    <!-- TodoInput 組件 -->
    <TodoInput on:add={addTodo} />

    <!-- 統計信息 -->
    {#if todos.length > 0}
      <div class="stats">
        <div class="stat-item">
          <span class="stat-label">總計</span>
          <span class="stat-value">{todos.length}</span>
        </div>
        <div class="stat-item active">
          <span class="stat-label">進行中</span>
          <span class="stat-value">{activeCount}</span>
        </div>
        <div class="stat-item completed">
          <span class="stat-label">已完成</span>
          <span class="stat-value">{completedCount}</span>
        </div>
      </div>

      <!-- 過濾器 -->
      <div class="filters">
        <button
          class="filter-btn"
          class:active={filter === 'all'}
          on:click={() => filter = 'all'}
        >
          全部
        </button>
        <button
          class="filter-btn"
          class:active={filter === 'active'}
          on:click={() => filter = 'active'}
        >
          進行中 ({activeCount})
        </button>
        <button
          class="filter-btn"
          class:active={filter === 'completed'}
          on:click={() => filter = 'completed'}
        >
          已完成 ({completedCount})
        </button>
      </div>

      <!-- 批量操作 -->
      <div class="bulk-actions">
        <button class="action-btn" on:click={toggleAll}>
          {todos.every(t => t.completed) ? '取消全部' : '全部完成'}
        </button>
        {#if completedCount > 0}
          <button class="action-btn danger" on:click={clearCompleted}>
            清除已完成 ({completedCount})
          </button>
        {/if}
      </div>
    {/if}

    <!-- TodoList 組件 -->
    <TodoList
      todos={filteredTodos}
      on:toggle={toggleTodo}
      on:delete={deleteTodo}
      on:edit={editTodo}
    />

    <!-- 空狀態 -->
    {#if todos.length === 0}
      <div class="empty-state">
        <div class="empty-icon">✨</div>
        <h3>還沒有待辦事項</h3>
        <p>開始添加您的第一個任務吧！</p>
      </div>
    {:else if filteredTodos.length === 0}
      <div class="empty-state">
        <div class="empty-icon">🎯</div>
        <h3>沒有符合條件的待辦事項</h3>
        <p>試試切換其他篩選條件</p>
      </div>
    {/if}

    <!-- 頁腳 -->
    <footer class="footer">
      <p>使用 <strong>Svelte 4</strong> 構建</p>
      <p class="tech-stack">Vite • 編譯時框架 • 無虛擬 DOM</p>
    </footer>
  </div>
</main>

<style>
  .app {
    min-height: 100vh;
    padding: 2rem 1rem;
  }

  .container {
    max-width: 700px;
    margin: 0 auto;
  }

  .header {
    text-align: center;
    margin-bottom: 2rem;
  }

  .header h1 {
    font-size: 2.5rem;
    margin: 0 0 0.5rem 0;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .subtitle {
    color: #666;
    font-size: 0.95rem;
    margin: 0;
  }

  /* 統計信息 */
  .stats {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1rem;
    margin-bottom: 1.5rem;
  }

  .stat-item {
    background: white;
    padding: 1rem;
    border-radius: 12px;
    text-align: center;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    transition: transform 0.2s;
  }

  .stat-item:hover {
    transform: translateY(-2px);
  }

  .stat-item.active {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
  }

  .stat-item.completed {
    background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
    color: white;
  }

  .stat-label {
    display: block;
    font-size: 0.85rem;
    opacity: 0.9;
    margin-bottom: 0.5rem;
  }

  .stat-value {
    display: block;
    font-size: 1.8rem;
    font-weight: bold;
  }

  /* 過濾器 */
  .filters {
    display: flex;
    gap: 0.5rem;
    margin-bottom: 1rem;
    background: white;
    padding: 0.5rem;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }

  .filter-btn {
    flex: 1;
    padding: 0.75rem;
    border: none;
    background: transparent;
    border-radius: 8px;
    cursor: pointer;
    font-size: 0.9rem;
    font-weight: 500;
    color: #666;
    transition: all 0.3s;
  }

  .filter-btn:hover {
    background: #f5f5f5;
  }

  .filter-btn.active {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
  }

  /* 批量操作 */
  .bulk-actions {
    display: flex;
    gap: 0.5rem;
    margin-bottom: 1.5rem;
  }

  .action-btn {
    flex: 1;
    padding: 0.75rem;
    border: 2px solid #e0e0e0;
    background: white;
    border-radius: 8px;
    cursor: pointer;
    font-size: 0.9rem;
    font-weight: 500;
    transition: all 0.3s;
  }

  .action-btn:hover {
    border-color: #667eea;
    color: #667eea;
  }

  .action-btn.danger:hover {
    border-color: #f5576c;
    color: #f5576c;
  }

  /* 空狀態 */
  .empty-state {
    text-align: center;
    padding: 3rem 1rem;
    background: white;
    border-radius: 16px;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  }

  .empty-icon {
    font-size: 4rem;
    margin-bottom: 1rem;
  }

  .empty-state h3 {
    margin: 0 0 0.5rem 0;
    color: #333;
  }

  .empty-state p {
    margin: 0;
    color: #666;
  }

  /* 頁腳 */
  .footer {
    margin-top: 3rem;
    text-align: center;
    color: #666;
    font-size: 0.9rem;
  }

  .footer p {
    margin: 0.25rem 0;
  }

  .tech-stack {
    font-size: 0.85rem;
    opacity: 0.8;
  }

  /* 響應式設計 */
  @media (max-width: 640px) {
    .header h1 {
      font-size: 2rem;
    }

    .stats {
      grid-template-columns: 1fr;
    }

    .filters {
      flex-direction: column;
    }

    .bulk-actions {
      flex-direction: column;
    }
  }
</style>
