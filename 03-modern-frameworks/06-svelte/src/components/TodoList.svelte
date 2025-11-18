<script>
  import TodoItem from './TodoItem.svelte';
  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher();

  // Props（從父組件接收數據）
  // Svelte 使用 export 來聲明 props
  export let todos = [];

  // 事件轉發：將子組件事件傳遞給父組件
  function handleToggle(event) {
    dispatch('toggle', event.detail);
  }

  function handleDelete(event) {
    dispatch('delete', event.detail);
  }

  function handleEdit(event) {
    dispatch('edit', event.detail);
  }
</script>

<div class="todo-list">
  {#each todos as todo (todo.id)}
    <!-- 列表渲染：#each 塊 -->
    <!-- (todo.id) 是 key，用於優化渲染性能 -->
    <div class="todo-item-wrapper">
      <TodoItem
        {todo}
        on:toggle={handleToggle}
        on:delete={handleDelete}
        on:edit={handleEdit}
      />
    </div>
  {/each}
</div>

<style>
  .todo-list {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  .todo-item-wrapper {
    animation: slideIn 0.3s ease-out;
  }

  @keyframes slideIn {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
</style>
