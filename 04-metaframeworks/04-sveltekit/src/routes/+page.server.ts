import type { Actions, PageServerLoad } from './$types';
import { todoStore } from '$lib/store';

// Load function - 在伺服器端執行，為頁面提供數據
export const load: PageServerLoad = async () => {
	return {
		todos: todoStore.getAll()
	};
};

// Actions - 處理表單提交和其他操作
export const actions: Actions = {
	// 添加新的 Todo
	add: async ({ request }) => {
		const data = await request.formData();
		const text = data.get('text') as string;

		if (text && text.trim()) {
			todoStore.add(text);
		}

		return { success: true };
	},

	// 切換完成狀態
	toggle: async ({ request }) => {
		const data = await request.formData();
		const id = parseInt(data.get('id') as string);

		todoStore.toggle(id);

		return { success: true };
	},

	// 刪除 Todo
	delete: async ({ request }) => {
		const data = await request.formData();
		const id = parseInt(data.get('id') as string);

		todoStore.delete(id);

		return { success: true };
	},

	// 清除所有已完成的項目
	clearCompleted: async () => {
		todoStore.clearCompleted();
		return { success: true };
	}
};
