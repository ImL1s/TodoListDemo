import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { Preferences } from '@capacitor/preferences';
import { Todo, TodoFilter, TodoStats } from '../models/todo.interface';

/**
 * TodoService
 *
 * Central service for managing todo items using Angular services
 * and Capacitor Preferences API for persistent storage.
 *
 * Features:
 * - CRUD operations for todos
 * - RxJS observables for reactive state management
 * - Persistent storage using Capacitor Preferences
 * - Filter support (all, active, completed)
 * - Statistics computation
 */
@Injectable({
  providedIn: 'root'
})
export class TodoService {
  private readonly STORAGE_KEY = 'ionic-angular-todos';

  // BehaviorSubject to maintain the current state of todos
  private todosSubject = new BehaviorSubject<Todo[]>([]);

  // Observable stream of todos for components to subscribe to
  public todos$: Observable<Todo[]> = this.todosSubject.asObservable();

  // Current filter state
  private filterSubject = new BehaviorSubject<TodoFilter>('all');
  public filter$: Observable<TodoFilter> = this.filterSubject.asObservable();

  // Filtered todos based on current filter
  public filteredTodos$: Observable<Todo[]> = this.todos$.pipe(
    map(todos => this.applyFilter(todos, this.filterSubject.value))
  );

  // Statistics observable
  public stats$: Observable<TodoStats> = this.todos$.pipe(
    map(todos => this.calculateStats(todos))
  );

  constructor() {
    this.loadTodos();
  }

  /**
   * Load todos from persistent storage
   */
  private async loadTodos(): Promise<void> {
    try {
      const { value } = await Preferences.get({ key: this.STORAGE_KEY });
      if (value) {
        const todos: Todo[] = JSON.parse(value);
        this.todosSubject.next(todos);
      }
    } catch (error) {
      console.error('Error loading todos:', error);
    }
  }

  /**
   * Save todos to persistent storage
   */
  private async saveTodos(todos: Todo[]): Promise<void> {
    try {
      await Preferences.set({
        key: this.STORAGE_KEY,
        value: JSON.stringify(todos)
      });
    } catch (error) {
      console.error('Error saving todos:', error);
    }
  }

  /**
   * Get current todos value (synchronous)
   */
  private getCurrentTodos(): Todo[] {
    return this.todosSubject.value;
  }

  /**
   * Add a new todo item
   */
  async addTodo(text: string): Promise<void> {
    const trimmedText = text.trim();
    if (!trimmedText) {
      return;
    }

    const newTodo: Todo = {
      id: this.generateId(),
      text: trimmedText,
      completed: false,
      createdAt: Date.now()
    };

    const updatedTodos = [...this.getCurrentTodos(), newTodo];
    this.todosSubject.next(updatedTodos);
    await this.saveTodos(updatedTodos);
  }

  /**
   * Toggle the completed status of a todo
   */
  async toggleTodo(id: string): Promise<void> {
    const updatedTodos = this.getCurrentTodos().map(todo =>
      todo.id === id
        ? {
            ...todo,
            completed: !todo.completed,
            updatedAt: Date.now()
          }
        : todo
    );

    this.todosSubject.next(updatedTodos);
    await this.saveTodos(updatedTodos);
  }

  /**
   * Delete a todo item
   */
  async deleteTodo(id: string): Promise<void> {
    const updatedTodos = this.getCurrentTodos().filter(todo => todo.id !== id);
    this.todosSubject.next(updatedTodos);
    await this.saveTodos(updatedTodos);
  }

  /**
   * Update the text of a todo item
   */
  async updateTodo(id: string, text: string): Promise<void> {
    const trimmedText = text.trim();
    if (!trimmedText) {
      return;
    }

    const updatedTodos = this.getCurrentTodos().map(todo =>
      todo.id === id
        ? {
            ...todo,
            text: trimmedText,
            updatedAt: Date.now()
          }
        : todo
    );

    this.todosSubject.next(updatedTodos);
    await this.saveTodos(updatedTodos);
  }

  /**
   * Clear all completed todos
   */
  async clearCompleted(): Promise<void> {
    const updatedTodos = this.getCurrentTodos().filter(todo => !todo.completed);
    this.todosSubject.next(updatedTodos);
    await this.saveTodos(updatedTodos);
  }

  /**
   * Toggle all todos to completed or active
   */
  async toggleAll(completed: boolean): Promise<void> {
    const updatedTodos = this.getCurrentTodos().map(todo => ({
      ...todo,
      completed,
      updatedAt: Date.now()
    }));

    this.todosSubject.next(updatedTodos);
    await this.saveTodos(updatedTodos);
  }

  /**
   * Set the current filter
   */
  setFilter(filter: TodoFilter): void {
    this.filterSubject.next(filter);
  }

  /**
   * Apply filter to todos
   */
  private applyFilter(todos: Todo[], filter: TodoFilter): Todo[] {
    switch (filter) {
      case 'active':
        return todos.filter(todo => !todo.completed);
      case 'completed':
        return todos.filter(todo => todo.completed);
      default:
        return todos;
    }
  }

  /**
   * Calculate statistics for todos
   */
  private calculateStats(todos: Todo[]): TodoStats {
    return {
      total: todos.length,
      active: todos.filter(todo => !todo.completed).length,
      completed: todos.filter(todo => todo.completed).length
    };
  }

  /**
   * Generate a unique ID for a todo item
   */
  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Clear all todos
   */
  async clearAll(): Promise<void> {
    this.todosSubject.next([]);
    await this.saveTodos([]);
  }
}
