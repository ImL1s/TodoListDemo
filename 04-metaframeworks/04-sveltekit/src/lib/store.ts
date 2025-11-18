// 共享的數據存儲
// 在實際應用中，這應該使用數據庫

export interface Todo {
	id: number;
	text: string;
	completed: boolean;
}

// 記憶體中的 todos 存儲
let todos: Todo[] = [
	{ id: 1, text: '學習 SvelteKit', completed: false },
	{ id: 2, text: '理解 Server Routes', completed: false },
	{ id: 3, text: '掌握 Load Functions', completed: false }
];

let nextId = 4;

// 數據存儲操作
export const todoStore = {
	// 獲取所有 todos
	getAll(): Todo[] {
		return todos;
	},

	// 根據 ID 獲取單個 todo
	getById(id: number): Todo | undefined {
		return todos.find(t => t.id === id);
	},

	// 添加新 todo
	add(text: string): Todo {
		const newTodo: Todo = {
			id: nextId++,
			text: text.trim(),
			completed: false
		};
		todos.push(newTodo);
		return newTodo;
	},

	// 更新 todo
	update(id: number, updates: Partial<Omit<Todo, 'id'>>): Todo | undefined {
		const todo = todos.find(t => t.id === id);
		if (todo) {
			if (updates.text !== undefined) todo.text = updates.text;
			if (updates.completed !== undefined) todo.completed = updates.completed;
		}
		return todo;
	},

	// 切換完成狀態
	toggle(id: number): Todo | undefined {
		const todo = todos.find(t => t.id === id);
		if (todo) {
			todo.completed = !todo.completed;
		}
		return todo;
	},

	// 刪除 todo
	delete(id: number): boolean {
		const index = todos.findIndex(t => t.id === id);
		if (index !== -1) {
			todos.splice(index, 1);
			return true;
		}
		return false;
	},

	// 清除所有已完成的 todos
	clearCompleted(): number {
		const beforeLength = todos.length;
		todos = todos.filter(t => !t.completed);
		return beforeLength - todos.length;
	},

	// 標記所有為完成/未完成
	markAll(completed: boolean): void {
		todos.forEach(t => t.completed = completed);
	},

	// 刪除所有 todos
	deleteAll(): number {
		const count = todos.length;
		todos = [];
		nextId = 1;
		return count;
	},

	// 獲取統計資訊
	getStats() {
		return {
			total: todos.length,
			active: todos.filter(t => !t.completed).length,
			completed: todos.filter(t => t.completed).length
		};
	}
};
