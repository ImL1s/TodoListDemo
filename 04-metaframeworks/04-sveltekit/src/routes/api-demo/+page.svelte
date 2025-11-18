<script lang="ts">
	import { onMount } from 'svelte';

	let todos: any[] = [];
	let stats: any = {};
	let newTodoText = '';
	let apiResponse = '';
	let loading = false;

	async function fetchTodos() {
		loading = true;
		try {
			const response = await fetch('/api/todos');
			const data = await response.json();
			todos = data.todos;
			stats = data.stats;
			apiResponse = JSON.stringify(data, null, 2);
		} catch (error) {
			apiResponse = `錯誤: ${error}`;
		}
		loading = false;
	}

	async function addTodo() {
		if (!newTodoText.trim()) return;

		loading = true;
		try {
			const response = await fetch('/api/todos', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ text: newTodoText })
			});
			const data = await response.json();
			apiResponse = JSON.stringify(data, null, 2);
			newTodoText = '';
			await fetchTodos();
		} catch (error) {
			apiResponse = `錯誤: ${error}`;
		}
		loading = false;
	}

	async function toggleTodo(id: number) {
		loading = true;
		try {
			const todo = todos.find(t => t.id === id);
			const response = await fetch(`/api/todos/${id}`, {
				method: 'PATCH',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ completed: !todo.completed })
			});
			const data = await response.json();
			apiResponse = JSON.stringify(data, null, 2);
			await fetchTodos();
		} catch (error) {
			apiResponse = `錯誤: ${error}`;
		}
		loading = false;
	}

	async function deleteTodo(id: number) {
		loading = true;
		try {
			const response = await fetch(`/api/todos/${id}`, {
				method: 'DELETE'
			});
			const data = await response.json();
			apiResponse = JSON.stringify(data, null, 2);
			await fetchTodos();
		} catch (error) {
			apiResponse = `錯誤: ${error}`;
		}
		loading = false;
	}

	async function clearCompleted() {
		loading = true;
		try {
			const response = await fetch('/api/todos', {
				method: 'PATCH',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ clearCompleted: true })
			});
			const data = await response.json();
			apiResponse = JSON.stringify(data, null, 2);
			await fetchTodos();
		} catch (error) {
			apiResponse = `錯誤: ${error}`;
		}
		loading = false;
	}

	onMount(() => {
		fetchTodos();
	});
</script>

<svelte:head>
	<title>SvelteKit API Demo</title>
</svelte:head>

<div class="container">
	<header>
		<h1>SvelteKit API 測試頁面</h1>
		<a href="/">返回主頁</a>
	</header>

	<div class="content">
		<div class="panel">
			<h2>API 操作</h2>

			<div class="section">
				<h3>添加 Todo</h3>
				<div class="input-group">
					<input
						type="text"
						bind:value={newTodoText}
						placeholder="輸入任務..."
						on:keypress={(e) => e.key === 'Enter' && addTodo()}
					/>
					<button on:click={addTodo} disabled={loading}>添加</button>
				</div>
			</div>

			<div class="section">
				<h3>統計資訊</h3>
				<div class="stats">
					<div class="stat">總計: {stats.total || 0}</div>
					<div class="stat">進行中: {stats.active || 0}</div>
					<div class="stat">已完成: {stats.completed || 0}</div>
				</div>
			</div>

			<div class="section">
				<h3>Todo 列表</h3>
				<button on:click={fetchTodos} disabled={loading}>刷新列表</button>
				<button on:click={clearCompleted} disabled={loading}>清除已完成</button>

				<ul class="todo-list">
					{#each todos as todo}
						<li class:completed={todo.completed}>
							<span class="todo-text">{todo.text}</span>
							<div class="actions">
								<button on:click={() => toggleTodo(todo.id)} disabled={loading}>
									{todo.completed ? '未完成' : '完成'}
								</button>
								<button on:click={() => deleteTodo(todo.id)} disabled={loading} class="delete">
									刪除
								</button>
							</div>
						</li>
					{:else}
						<li class="empty">沒有任務</li>
					{/each}
				</ul>
			</div>
		</div>

		<div class="panel">
			<h2>API 回應</h2>
			<pre class="response">{apiResponse || '等待 API 回應...'}</pre>

			<h3>可用的 API Endpoints</h3>
			<div class="endpoints">
				<div class="endpoint">
					<strong>GET /api/todos</strong>
					<p>獲取所有 todos 和統計資訊</p>
				</div>
				<div class="endpoint">
					<strong>POST /api/todos</strong>
					<p>創建新 todo</p>
				</div>
				<div class="endpoint">
					<strong>GET /api/todos/[id]</strong>
					<p>獲取特定 todo</p>
				</div>
				<div class="endpoint">
					<strong>PATCH /api/todos/[id]</strong>
					<p>更新特定 todo</p>
				</div>
				<div class="endpoint">
					<strong>DELETE /api/todos/[id]</strong>
					<p>刪除特定 todo</p>
				</div>
				<div class="endpoint">
					<strong>PATCH /api/todos</strong>
					<p>批量操作（clearCompleted, markAllCompleted）</p>
				</div>
			</div>
		</div>
	</div>
</div>

<style>
	:global(body) {
		margin: 0;
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
		background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
		min-height: 100vh;
	}

	.container {
		max-width: 1200px;
		margin: 0 auto;
		padding: 2rem;
	}

	header {
		text-align: center;
		color: white;
		margin-bottom: 2rem;
	}

	header h1 {
		margin: 0 0 1rem;
		font-size: 2rem;
	}

	header a {
		color: white;
		text-decoration: none;
		padding: 0.5rem 1rem;
		background: rgba(255, 255, 255, 0.2);
		border-radius: 6px;
		transition: background 0.2s;
	}

	header a:hover {
		background: rgba(255, 255, 255, 0.3);
	}

	.content {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 2rem;
	}

	@media (max-width: 768px) {
		.content {
			grid-template-columns: 1fr;
		}
	}

	.panel {
		background: white;
		border-radius: 12px;
		padding: 2rem;
		box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
	}

	.panel h2 {
		margin-top: 0;
		color: #667eea;
	}

	.section {
		margin: 1.5rem 0;
	}

	.section h3 {
		color: #333;
		font-size: 1rem;
		margin-bottom: 0.5rem;
	}

	.input-group {
		display: flex;
		gap: 0.5rem;
	}

	.input-group input {
		flex: 1;
		padding: 0.75rem;
		border: 2px solid #e0e0e0;
		border-radius: 6px;
		font-size: 1rem;
	}

	.input-group input:focus {
		outline: none;
		border-color: #667eea;
	}

	button {
		padding: 0.75rem 1.5rem;
		background: #667eea;
		color: white;
		border: none;
		border-radius: 6px;
		cursor: pointer;
		font-size: 0.9rem;
		transition: background 0.2s;
	}

	button:hover:not(:disabled) {
		background: #5568d3;
	}

	button:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	button.delete {
		background: #ff4757;
	}

	button.delete:hover:not(:disabled) {
		background: #ee5a6f;
	}

	.stats {
		display: flex;
		gap: 1rem;
	}

	.stat {
		flex: 1;
		padding: 1rem;
		background: #f5f5f5;
		border-radius: 6px;
		text-align: center;
		font-weight: 600;
		color: #667eea;
	}

	.todo-list {
		list-style: none;
		padding: 0;
		margin: 1rem 0 0;
	}

	.todo-list li {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 1rem;
		margin-bottom: 0.5rem;
		background: #f9f9f9;
		border-radius: 6px;
	}

	.todo-list li.completed {
		opacity: 0.6;
	}

	.todo-list li.completed .todo-text {
		text-decoration: line-through;
	}

	.todo-list li.empty {
		text-align: center;
		color: #999;
		font-style: italic;
	}

	.todo-text {
		flex: 1;
	}

	.actions {
		display: flex;
		gap: 0.5rem;
	}

	.actions button {
		padding: 0.5rem 1rem;
		font-size: 0.85rem;
	}

	.response {
		background: #1e1e1e;
		color: #d4d4d4;
		padding: 1rem;
		border-radius: 6px;
		overflow-x: auto;
		font-size: 0.85rem;
		line-height: 1.5;
		margin: 1rem 0;
	}

	.endpoints {
		margin-top: 1rem;
	}

	.endpoint {
		padding: 1rem;
		margin-bottom: 0.5rem;
		background: #f9f9f9;
		border-radius: 6px;
		border-left: 3px solid #667eea;
	}

	.endpoint strong {
		color: #667eea;
		display: block;
		margin-bottom: 0.25rem;
	}

	.endpoint p {
		margin: 0;
		color: #666;
		font-size: 0.9rem;
	}
</style>
