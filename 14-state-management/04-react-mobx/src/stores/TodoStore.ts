/**
 * MobX Todo Store
 *
 * 展示 MobX 的核心特性：
 * 1. Observable State - 可觀察的狀態
 * 2. Actions - 修改狀態的方法
 * 3. Computed Values - 派生狀態
 * 4. Reactions - 自動追蹤依賴
 */

import { makeAutoObservable, reaction } from 'mobx';
import { Todo, FilterType, TodoStats } from '../types';

class TodoStore {
  // Observable State - 可觀察的狀態
  todos: Todo[] = [];
  filter: FilterType = 'all';

  constructor() {
    // makeAutoObservable 自動將所有屬性轉換為 observable
    // 所有方法轉換為 action
    // 所有 getter 轉換為 computed
    makeAutoObservable(this);

    // 從 localStorage 加載數據
    this.loadFromStorage();

    // 設置 reaction - 當 todos 變化時自動保存到 localStorage
    reaction(
      () => this.todos,
      (todos) => {
        localStorage.setItem('mobx-todos', JSON.stringify(todos));
      }
    );
  }

  // Actions - 修改狀態的方法
  addTodo(text: string) {
    const newTodo: Todo = {
      id: Date.now().toString(),
      text: text.trim(),
      completed: false,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    this.todos.unshift(newTodo);
  }

  toggleTodo(id: string) {
    const todo = this.todos.find((t) => t.id === id);
    if (todo) {
      todo.completed = !todo.completed;
      todo.updatedAt = Date.now();
    }
  }

  deleteTodo(id: string) {
    this.todos = this.todos.filter((t) => t.id !== id);
  }

  editTodo(id: string, text: string) {
    const todo = this.todos.find((t) => t.id === id);
    if (todo) {
      todo.text = text.trim();
      todo.updatedAt = Date.now();
    }
  }

  setFilter(filter: FilterType) {
    this.filter = filter;
  }

  clearCompleted() {
    this.todos = this.todos.filter((t) => !t.completed);
  }

  toggleAll() {
    const allCompleted = this.todos.every((t) => t.completed);
    this.todos.forEach((todo) => {
      todo.completed = !allCompleted;
      todo.updatedAt = Date.now();
    });
  }

  // Computed Values - 派生狀態（自動緩存，只有依賴變化時才重新計算）
  get filteredTodos(): Todo[] {
    switch (this.filter) {
      case 'active':
        return this.todos.filter((t) => !t.completed);
      case 'completed':
        return this.todos.filter((t) => t.completed);
      default:
        return this.todos;
    }
  }

  get stats(): TodoStats {
    return {
      total: this.todos.length,
      active: this.todos.filter((t) => !t.completed).length,
      completed: this.todos.filter((t) => t.completed).length,
    };
  }

  get hasCompletedTodos(): boolean {
    return this.todos.some((t) => t.completed);
  }

  get allCompleted(): boolean {
    return this.todos.length > 0 && this.todos.every((t) => t.completed);
  }

  // Private Methods
  private loadFromStorage() {
    const stored = localStorage.getItem('mobx-todos');
    if (stored) {
      try {
        this.todos = JSON.parse(stored);
      } catch (error) {
        console.error('Failed to load todos from storage:', error);
      }
    }
  }
}

// 創建單例實例
export const todoStore = new TodoStore();
