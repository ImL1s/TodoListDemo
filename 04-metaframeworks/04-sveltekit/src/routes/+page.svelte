<script lang="ts">
	import { enhance } from '$app/forms';
	import type { PageData } from './$types';

	export let data: PageData;

	let newTodoText = '';
	let filter: 'all' | 'active' | 'completed' = 'all';

	// 計算統計數據
	$: totalCount = data.todos.length;
	$: activeCount = data.todos.filter(t => !t.completed).length;
	$: completedCount = data.todos.filter(t => t.completed).length;

	// 過濾顯示的項目
	$: filteredTodos = data.todos.filter(todo => {
		if (filter === 'active') return !todo.completed;
		if (filter === 'completed') return todo.completed;
		return true;
	});

	// 重置輸入框
	function resetInput() {
		newTodoText = '';
	}
</script>

<svelte:head>
	<title>SvelteKit Todo List</title>
</svelte:head>

<div class="container">
	<header>
		<h1>SvelteKit Todo List</h1>
		<p class="subtitle">使用 SvelteKit 全棧框架構建</p>
	</header>

	<main>
		<!-- 添加新任務的表單 -->
		<form
			method="POST"
			action="?/add"
			use:enhance={() => {
				return async ({ update }) => {
					await update();
					resetInput();
				};
			}}
			class="add-form"
		>
			<input
				type="text"
				name="text"
				bind:value={newTodoText}
				placeholder="輸入新任務..."
				required
			/>
			<button type="submit">添加</button>
		</form>

		<!-- 過濾按鈕 -->
		<div class="filters">
			<button
				class:active={filter === 'all'}
				on:click={() => filter = 'all'}
			>
				全部 ({totalCount})
			</button>
			<button
				class:active={filter === 'active'}
				on:click={() => filter = 'active'}
			>
				進行中 ({activeCount})
			</button>
			<button
				class:active={filter === 'completed'}
				on:click={() => filter = 'completed'}
			>
				已完成 ({completedCount})
			</button>
		</div>

		<!-- Todo 列表 -->
		<ul class="todo-list">
			{#each filteredTodos as todo (todo.id)}
				<li class="todo-item" class:completed={todo.completed}>
					<form
						method="POST"
						action="?/toggle"
						use:enhance
						style="display: inline;"
					>
						<input type="hidden" name="id" value={todo.id} />
						<button type="submit" class="checkbox">
							{#if todo.completed}✓{/if}
						</button>
					</form>

					<span class="todo-text">{todo.text}</span>

					<form
						method="POST"
						action="?/delete"
						use:enhance
						style="display: inline;"
					>
						<input type="hidden" name="id" value={todo.id} />
						<button type="submit" class="delete-btn">×</button>
					</form>
				</li>
			{:else}
				<li class="empty-state">
					{#if filter === 'all'}
						還沒有任務，開始添加一個吧！
					{:else if filter === 'active'}
						沒有進行中的任務
					{:else}
						沒有已完成的任務
					{/if}
				</li>
			{/each}
		</ul>

		<!-- 底部操作 -->
		{#if completedCount > 0}
			<form method="POST" action="?/clearCompleted" use:enhance class="footer-actions">
				<button type="submit" class="clear-btn">
					清除已完成 ({completedCount})
				</button>
			</form>
		{/if}
	</main>

	<footer class="app-footer">
		<h3>SvelteKit 特色展示</h3>
		<ul class="features">
			<li><strong>Load Functions:</strong> 使用 +page.server.ts 的 load function 進行伺服器端數據加載</li>
			<li><strong>Form Actions:</strong> 使用 SvelteKit 的表單操作處理數據變更</li>
			<li><strong>Progressive Enhancement:</strong> use:enhance 提供漸進式增強體驗</li>
			<li><strong>SSR Ready:</strong> 支援伺服器端渲染，首次載入即顯示內容</li>
			<li><strong>Type Safety:</strong> 完整的 TypeScript 支援與類型推導</li>
		</ul>
	</footer>
</div>

<style>
	:global(body) {
		margin: 0;
		padding: 0;
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
		background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
		min-height: 100vh;
	}

	.container {
		max-width: 600px;
		margin: 0 auto;
		padding: 2rem 1rem;
	}

	header {
		text-align: center;
		color: white;
		margin-bottom: 2rem;
	}

	h1 {
		margin: 0;
		font-size: 2.5rem;
		font-weight: 700;
	}

	.subtitle {
		margin: 0.5rem 0 0;
		opacity: 0.9;
		font-size: 1rem;
	}

	main {
		background: white;
		border-radius: 12px;
		padding: 2rem;
		box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
	}

	.add-form {
		display: flex;
		gap: 0.5rem;
		margin-bottom: 1.5rem;
	}

	.add-form input {
		flex: 1;
		padding: 0.75rem 1rem;
		border: 2px solid #e0e0e0;
		border-radius: 8px;
		font-size: 1rem;
		transition: border-color 0.2s;
	}

	.add-form input:focus {
		outline: none;
		border-color: #667eea;
	}

	.add-form button {
		padding: 0.75rem 1.5rem;
		background: #667eea;
		color: white;
		border: none;
		border-radius: 8px;
		font-size: 1rem;
		font-weight: 600;
		cursor: pointer;
		transition: background 0.2s;
	}

	.add-form button:hover {
		background: #5568d3;
	}

	.filters {
		display: flex;
		gap: 0.5rem;
		margin-bottom: 1.5rem;
		padding-bottom: 1rem;
		border-bottom: 2px solid #f0f0f0;
	}

	.filters button {
		flex: 1;
		padding: 0.5rem 1rem;
		background: #f5f5f5;
		border: 2px solid transparent;
		border-radius: 6px;
		font-size: 0.9rem;
		cursor: pointer;
		transition: all 0.2s;
	}

	.filters button:hover {
		background: #e8e8e8;
	}

	.filters button.active {
		background: #667eea;
		color: white;
		border-color: #667eea;
	}

	.todo-list {
		list-style: none;
		padding: 0;
		margin: 0;
	}

	.todo-item {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		padding: 1rem;
		border-radius: 8px;
		margin-bottom: 0.5rem;
		background: #f9f9f9;
		transition: all 0.2s;
	}

	.todo-item:hover {
		background: #f0f0f0;
		transform: translateX(4px);
	}

	.todo-item.completed {
		opacity: 0.6;
	}

	.checkbox {
		width: 24px;
		height: 24px;
		border: 2px solid #667eea;
		border-radius: 6px;
		background: white;
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 1rem;
		color: #667eea;
		transition: all 0.2s;
		padding: 0;
	}

	.checkbox:hover {
		background: #f0f0ff;
	}

	.todo-text {
		flex: 1;
		font-size: 1rem;
	}

	.completed .todo-text {
		text-decoration: line-through;
	}

	.delete-btn {
		width: 28px;
		height: 28px;
		border: none;
		border-radius: 6px;
		background: #ff4757;
		color: white;
		font-size: 1.5rem;
		line-height: 1;
		cursor: pointer;
		transition: all 0.2s;
		padding: 0;
	}

	.delete-btn:hover {
		background: #ee5a6f;
		transform: scale(1.1);
	}

	.empty-state {
		text-align: center;
		padding: 3rem 1rem;
		color: #999;
		font-style: italic;
	}

	.footer-actions {
		margin-top: 1.5rem;
		padding-top: 1.5rem;
		border-top: 2px solid #f0f0f0;
		text-align: center;
	}

	.clear-btn {
		padding: 0.5rem 1.5rem;
		background: #ff4757;
		color: white;
		border: none;
		border-radius: 6px;
		cursor: pointer;
		font-size: 0.9rem;
		transition: background 0.2s;
	}

	.clear-btn:hover {
		background: #ee5a6f;
	}

	.app-footer {
		margin-top: 2rem;
		padding: 1.5rem;
		background: rgba(255, 255, 255, 0.95);
		border-radius: 12px;
		box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
	}

	.app-footer h3 {
		margin-top: 0;
		color: #667eea;
		font-size: 1.2rem;
	}

	.features {
		list-style: none;
		padding: 0;
		margin: 0;
	}

	.features li {
		padding: 0.5rem 0;
		color: #333;
		line-height: 1.6;
	}

	.features strong {
		color: #667eea;
	}
</style>
