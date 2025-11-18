import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { todoStore } from '$lib/store';

// GET /api/todos/[id] - 獲取單個 todo
export const GET: RequestHandler = async ({ params }) => {
	const id = parseInt(params.id);
	const todo = todoStore.getById(id);

	if (!todo) {
		throw error(404, 'Todo not found');
	}

	return json(todo);
};

// PATCH /api/todos/[id] - 更新單個 todo
export const PATCH: RequestHandler = async ({ params, request }) => {
	const id = parseInt(params.id);
	const updates = await request.json();

	const updatedTodo = todoStore.update(id, updates);

	if (!updatedTodo) {
		throw error(404, 'Todo not found');
	}

	return json(updatedTodo);
};

// DELETE /api/todos/[id] - 刪除單個 todo
export const DELETE: RequestHandler = async ({ params }) => {
	const id = parseInt(params.id);
	const todo = todoStore.getById(id);

	if (!todo) {
		throw error(404, 'Todo not found');
	}

	const success = todoStore.delete(id);

	if (!success) {
		throw error(500, 'Failed to delete todo');
	}

	return json({
		message: 'Todo deleted',
		deleted: todo
	});
};
