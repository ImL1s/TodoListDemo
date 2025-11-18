import { makeAutoObservable } from 'mobx';
import type { Todo, FilterType } from '../types/todo';

/**
 * TodoStore - 使用 MobX 管理 Todo 應用的狀態
 *
 * MobX 核心概念：
 * 1. Observable State (可觀察狀態) - todos 和 filter
 * 2. Actions (動作) - 修改狀態的方法
 * 3. Computed Values (計算值) - 根據狀態自動計算的衍生數據
 * 4. Reactions (反應) - 自動響應狀態變化
 */
class TodoStore {
  // Observable: 可觀察的狀態
  todos: Todo[] = [];
  filter: FilterType = 'all';
  editingId: string | null = null;

  constructor() {
    // makeAutoObservable 自動將所有屬性設為 observable
    // 所有方法設為 action，所有 getter 設為 computed
    makeAutoObservable(this, {}, { autoBind: true });

    // 從 localStorage 載入數據
    this.loadFromStorage();
  }

  // ==================== Actions ====================
  // Actions: 修改狀態的方法，MobX 會自動追蹤這些修改

  /**
   * 新增 Todo
   */
  addTodo(text: string): void {
    if (!text.trim()) return;

    const newTodo: Todo = {
      id: Date.now().toString(),
      text: text.trim(),
      completed: false,
      createdAt: Date.now(),
    };

    this.todos.push(newTodo);
    this.saveToStorage();
  }

  /**
   * 切換 Todo 完成狀態
   */
  toggleTodo(id: string): void {
    const todo = this.todos.find((t) => t.id === id);
    if (todo) {
      todo.completed = !todo.completed;
      this.saveToStorage();
    }
  }

  /**
   * 刪除 Todo
   */
  deleteTodo(id: string): void {
    this.todos = this.todos.filter((t) => t.id !== id);
    this.saveToStorage();
  }

  /**
   * 編輯 Todo
   */
  updateTodo(id: string, text: string): void {
    const todo = this.todos.find((t) => t.id === id);
    if (todo && text.trim()) {
      todo.text = text.trim();
      this.editingId = null;
      this.saveToStorage();
    }
  }

  /**
   * 設定正在編輯的 Todo ID
   */
  setEditingId(id: string | null): void {
    this.editingId = id;
  }

  /**
   * 切換全部 Todo 的完成狀態
   */
  toggleAll(): void {
    const allCompleted = this.todos.every((t) => t.completed);
    this.todos.forEach((todo) => {
      todo.completed = !allCompleted;
    });
    this.saveToStorage();
  }

  /**
   * 清除所有已完成的 Todo
   */
  clearCompleted(): void {
    this.todos = this.todos.filter((t) => !t.completed);
    this.saveToStorage();
  }

  /**
   * 設定過濾器
   */
  setFilter(filter: FilterType): void {
    this.filter = filter;
  }

  // ==================== Computed Values ====================
  // Computed: 計算屬性，會自動根據依賴的 observable 重新計算
  // MobX 會緩存計算結果，只有在依賴改變時才重新計算

  /**
   * 根據當前過濾器返回過濾後的 Todos
   */
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

  /**
   * 未完成的 Todo 數量
   */
  get activeCount(): number {
    return this.todos.filter((t) => !t.completed).length;
  }

  /**
   * 已完成的 Todo 數量
   */
  get completedCount(): number {
    return this.todos.filter((t) => t.completed).length;
  }

  /**
   * 總 Todo 數量
   */
  get totalCount(): number {
    return this.todos.length;
  }

  /**
   * 是否有已完成的 Todo
   */
  get hasCompleted(): boolean {
    return this.completedCount > 0;
  }

  /**
   * 是否所有 Todo 都已完成
   */
  get allCompleted(): boolean {
    return this.totalCount > 0 && this.activeCount === 0;
  }

  // ==================== Persistence ====================
  // 持久化：localStorage 操作

  /**
   * 儲存到 localStorage
   */
  private saveToStorage(): void {
    try {
      localStorage.setItem('mobx-todos', JSON.stringify(this.todos));
    } catch (error) {
      console.error('Failed to save to localStorage:', error);
    }
  }

  /**
   * 從 localStorage 載入
   */
  private loadFromStorage(): void {
    try {
      const stored = localStorage.getItem('mobx-todos');
      if (stored) {
        this.todos = JSON.parse(stored);
      }
    } catch (error) {
      console.error('Failed to load from localStorage:', error);
    }
  }
}

// 創建並導出 store 實例（單例模式）
export const todoStore = new TodoStore();
