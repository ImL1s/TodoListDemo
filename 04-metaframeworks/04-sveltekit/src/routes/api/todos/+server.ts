import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { todoStore } from '$lib/store';

// GET /api/todos - 獲取所有 todos
export const GET: RequestHandler = async () => {
	return json({
		todos: todoStore.getAll(),
		stats: todoStore.getStats()
	});
};

// POST /api/todos - 創建新的 todo
export const POST: RequestHandler = async ({ request }) => {
	const { text } = await request.json();

	if (!text || !text.trim()) {
		return json(
			{ error: 'Todo text is required' },
			{ status: 400 }
		);
	}

	const newTodo = todoStore.add(text);

	return json(newTodo, { status: 201 });
};

// PATCH /api/todos - 批量更新
export const PATCH: RequestHandler = async ({ request }) => {
	const updates = await request.json();

	if (updates.clearCompleted) {
		const count = todoStore.clearCompleted();
		return json({
			message: 'Completed todos cleared',
			todos: todoStore.getAll(),
			count
		});
	}

	if (updates.markAllCompleted !== undefined) {
		todoStore.markAll(updates.markAllCompleted);
		return json({
			message: 'All todos updated',
			todos: todoStore.getAll()
		});
	}

	return json({ error: 'Invalid update operation' }, { status: 400 });
};

// DELETE /api/todos - 刪除所有 todos
export const DELETE: RequestHandler = async () => {
	const deletedCount = todoStore.deleteAll();

	return json({
		message: `Deleted ${deletedCount} todos`,
		deletedCount
	});
};
